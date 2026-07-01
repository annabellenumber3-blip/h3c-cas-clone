import sys
import json
import time
import logging as LOG

from glance import client as glanceclient
import netaddr

LOG.basicConfig(filename="/var/log/cas_glance.log", level=LOG.INFO)

def _is_valid_ipv6(address):
	try:
		return netaddr.valid_ipv6(address)
	except Exception:
		return False

def _create_glance_client(host, port, token):
	"""Instantiate a new glanceclient.Client object."""
	if _is_valid_ipv6(host):
		#if so, it is ipv6 address, need to wrap it with '[]'
		host = '[%s]' % host
	return glanceclient.V1Client(host, port, auth_tok=token)

class GlanceClientWrapper(object):
	"""Glance client wrapper class that implements retries."""

	def __init__(self, host, port, token):
		port = int(port)
		self.client = _create_glance_client(host, port, token)

	def download(self, image_id, dst_file):
		image_meta,image_data = self.call('get_image', image_id)
		data = open(dst_file, 'wb')
		try:
			for chunk in image_data:
				data.write(chunk)
		finally:
			data.close()

	def update(self, image_id, image_meta, src_file):
		image_meta = eval(image_meta)
		data = open(src_file, 'rb')
		try:
			self.call('update_image', image_id, image_meta, data)
		finally:
			data.close()
			
	def call(self, method, *args):
		"""
		Call a glance client method.  If we get a connection error,
		retry the request according to CONF.glance_num_retries.
		"""
		return getattr(self.client, method)(*args)
	
if __name__ == '__main__':
	currentTime = time.strftime('%Y-%m-%d %X')
	LOG.info("%s: %s" % (str(currentTime),sys.argv[1:]))
	
	try:
		if len(sys.argv[1:]) < 4:
			raise Exception("the number of arguments is less then 4")
		imageClient = GlanceClientWrapper(sys.argv[2],sys.argv[3],sys.argv[4])
		method = getattr(imageClient,sys.argv[1])
		method(*sys.argv[5:])
	except Exception as exc:
		error_info = str(exc)
		currentTime = time.strftime('%Y-%m-%d %X')
		LOG.error("%s: %s" % (str(currentTime),error_info))
		sys.exit(error_info)
	else:
		sys.exit(0)