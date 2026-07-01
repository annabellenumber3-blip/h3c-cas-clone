# SPDX-License-Identifier: LGPL-2.1-or-later

# Copyright (c) 2019 Red Hat, Inc.
# Copyright (c) 2019 Tomáš Mráz <tmraz@fedoraproject.org>
#
# This generator works for GnuTLS 3.6.12 or later.

from subprocess import call, CalledProcessError
from tempfile import mkstemp

import os

from .configgenerator import ConfigGenerator


class GnuTLSGenerator(ConfigGenerator):
	CONFIG_NAME = 'gnutls'

	mac_not_map = {
		'AEAD':'AEAD',
		'HMAC-SHA1':'SHA1',
		'HMAC-MD5':'MD5',
		'HMAC-SHA2-256':'SHA256',
		'HMAC-SHA2-384':'SHA384',
		'HMAC-SHA2-512':'SHA512',
		'STREEBOG-256':'STREEBOG-256',
		'STREEBOG-512':'STREEBOG-512',
		'GOST28147-TC26Z-IMIT':'GOST28147-TC26Z-IMIT'
	}

	hash_not_map = {
		'AEAD':'AEAD',
		'SHA1':'SHA1',
		'MD5':'MD5',
		'SHA2-256':'SHA256',
		'SHA2-384':'SHA384',
		'SHA2-512':'SHA512',
		'SHA3-256':'SHA3-256',
		'SHA3-384':'SHA3-384',
		'SHA3-512':'SHA3-512',
		'STREEBOG-256':'STREEBOG-256',
		'STREEBOG-512':'STREEBOG-512',
		'GOSTR94':'GOST341194'
	}

	group_not_map = {
		'X448':'',
		'X25519':'GROUP-X25519',
		'SECP256R1':'GROUP-SECP256R1',
		'SECP384R1':'GROUP-SECP384R1',
		'SECP521R1':'GROUP-SECP521R1',
		'FFDHE-6144':'GROUP-FFDHE6144',
		'FFDHE-2048':'GROUP-FFDHE2048',
		'FFDHE-3072':'GROUP-FFDHE3072',
		'FFDHE-4096':'GROUP-FFDHE4096',
		'FFDHE-8192':'GROUP-FFDHE8192',
		'GOST-GC256B':'GROUP-GC256B',
		'GOST-GC512A':'GROUP-GC512A'
	}

	sign_not_map = {
		'RSA-MD5':'RSA-MD5',
		'RSA-SHA1':'RSA-SHA1',
		'DSA-SHA1':'DSA-SHA1',
		'ECDSA-SHA1':'ECDSA-SHA1',
		'RSA-SHA2-224':'RSA-SHA224',
		'DSA-SHA2-224':'DSA-SHA224',
		'ECDSA-SHA2-224':'ECDSA-SHA224',
		'RSA-SHA2-256':'RSA-SHA256',
		'DSA-SHA2-256':'DSA-SHA256',
		'ECDSA-SHA2-256':'ECDSA-SHA256',
		'RSA-SHA2-384':'RSA-SHA384',
		'DSA-SHA2-384':'DSA-SHA384',
		'ECDSA-SHA2-384':'ECDSA-SHA384',
		'RSA-SHA2-512':'RSA-SHA512',
		'DSA-SHA2-512':'DSA-SHA512',
		'ECDSA-SHA2-512':'ECDSA-SHA512',
		# These are only available under 3.6.3+
		'RSA-PSS-SHA2-256':'RSA-PSS-SHA256',
		'RSA-PSS-SHA2-384':'RSA-PSS-SHA384',
		'RSA-PSS-SHA2-512':'RSA-PSS-SHA512',
		'RSA-PSS-RSAE-SHA2-256':'RSA-PSS-RSAE-SHA256',
		'RSA-PSS-RSAE-SHA2-384':'RSA-PSS-RSAE-SHA384',
		'RSA-PSS-RSAE-SHA2-512':'RSA-PSS-RSAE-SHA512',
		'EDDSA-ED25519':'EDDSA-ED25519',
		'GOSTR341012-512':'GOSTR341012-512',
		'GOSTR341012-256':'GOSTR341012-256',
		'GOSTR341001':'GOSTR341001'
	}

	sign_force_map = {
		'DSA-SHA1':'DSA-SHA1',
		'DSA-SHA2-224':'DSA-SHA224',
		'DSA-SHA2-256':'DSA-SHA256',
		'DSA-SHA2-384':'DSA-SHA384',
		'DSA-SHA2-512':'DSA-SHA512',
	}

	cipher_not_map = {
		'AES-256-CTR':'',
		'AES-128-CTR':'',
		'AES-256-GCM':'AES-256-GCM',
		'AES-128-GCM':'AES-128-GCM',
		'AES-256-CCM':'AES-256-CCM',
		'AES-128-CCM':'AES-128-CCM',
		'AES-256-CBC':'AES-256-CBC',
		'AES-128-CBC':'AES-128-CBC',
		'CAMELLIA-256-GCM':'CAMELLIA-256-GCM',
		'CAMELLIA-128-GCM':'CAMELLIA-128-GCM',
		'CAMELLIA-256-CBC':'CAMELLIA-256-CBC',
		'CAMELLIA-128-CBC':'CAMELLIA-128-CBC',
		'CHACHA20-POLY1305':'CHACHA20-POLY1305',
		'3DES-CBC':'3DES-CBC',
		'RC4-128':'ARCFOUR-128',
		'GOST28147-TC26Z-CFB':'GOST28147-TC26Z-CFB',
		'GOST28147-CPA-CFB':'GOST28147-CPA-CFB',
		'GOST28147-CPB-CFB':'GOST28147-CPB-CFB',
		'GOST28147-CPC-CFB':'GOST28147-CPC-CFB',
		'GOST28147-CPD-CFB':'GOST28147-CPD-CFB',
		'GOST28147-TC26Z-CNT':'GOST28147-TC26Z-CNT'
	}

	cipher_force_map = {
		'3DES-CBC':'3DES-CBC',
		'RC4-128':'ARCFOUR-128'
	}

	key_exchange_not_map = {
		#ECDHE is handled separately as it splits to ECDHE-ECDSA
		#and ECDHE-RSA.
		'RSA':'RSA',
		'DHE-RSA':'DHE-RSA',
		'DHE-DSS':'DHE-DSS',
		'PSK':'PSK',
		'DHE-PSK':'DHE-PSK',
		'ECDHE-PSK':'ECDHE-PSK',
		'VKO-GOST-12':'VKO-GOST-12'
	}

	key_exchange_force_map = {
		'DHE-DSS':'DHE-DSS'
	}

	protocol_not_map = {
		'SSL3.0':'SSL3.0',
		'TLS1.0':'TLS1.0',
		'TLS1.1':'TLS1.1',
		'TLS1.2':'TLS1.2',
		'TLS1.3':'TLS1.3',
		'DTLS1.0':'DTLS1.0',
		'DTLS1.2':'DTLS1.2'
	}

	@classmethod
	def generate_config(cls, policy):
		prio = 'NORMAL'
		s = ''
		p = policy.props
		ip = policy.inverted_props

		s += "[overrides]\n"

		if p['hash']:
			for i in ip['hash']:
				try:
					if cls.mac_not_map[i]:
						s += 'insecure-hash = '
						s += cls.hash_not_map[i]
						s += '\n'
				except KeyError:
					pass

		if p['mac']:
			for i in ip['mac']:
				try:
					if cls.mac_not_map[i]:
						s += 'tls-disabled-mac = '
						s += cls.mac_not_map[i]
						s += '\n'
				except KeyError:
					pass

		if p['group']:
			for i in ip['group']:
				try:
					if cls.group_not_map[i]:
						s += 'tls-disabled-group = '
						s += cls.group_not_map[i]
						s += '\n'
				except KeyError:
					pass

		if p['sign']:
			for i in ip['sign']:
				try:
					if cls.sign_not_map[i]:
						s += 'insecure-sig = '
						s += cls.sign_not_map[i]
						s += '\n'
				except KeyError:
					pass
			for i in p['sign']:
				try:
					if cls.sign_force_map[i]:
						prio = cls.append(prio, '+SIGN-' + cls.sign_force_map[i])
				except KeyError:
					pass

		if p['sha1_in_certs'] == 0:
			s += 'insecure-sig-for-cert = rsa-sha1\n'
			s += 'insecure-sig-for-cert = dsa-sha1\n'
			s += 'insecure-sig-for-cert = ecdsa-sha1\n'

		if p['tls_cipher']:
			for i in ip['tls_cipher']:
				try:
					if cls.cipher_not_map[i]:
						s += 'tls-disabled-cipher = '
						s += cls.cipher_not_map[i]
						s += '\n'
				except KeyError:
					pass
			for i in p['tls_cipher']:
				try:
					if cls.cipher_force_map[i]:
						prio = cls.append(prio, '+' + cls.cipher_force_map[i])
				except KeyError:
					pass

		if p['key_exchange']:
			for i in ip['key_exchange']:
				try:
					if i == 'ECDHE':
						s += 'tls-disabled-kx = ECDHE-RSA\n'
						s += 'tls-disabled-kx = ECDHE-ECDSA\n'
					elif cls.key_exchange_not_map[i]:
						s += 'tls-disabled-kx = '
						s += cls.key_exchange_not_map[i]
						s += '\n'
				except KeyError:
					pass
			for i in p['key_exchange']:
				try:
					if cls.key_exchange_force_map[i]:
						prio = cls.append(prio, '+' + cls.key_exchange_force_map[i])
				except KeyError:
					pass

		if p['protocol']:
			for i in ip['protocol']:
				try:
					if cls.protocol_not_map[i]:
						s += 'disabled-version = '
						s += cls.protocol_not_map[i]
						s += '\n'
				except KeyError:
					pass

		# We cannot separate RSA strength from DH params.
		if p['min_dh_size'] <= 768 or p['min_rsa_size'] <= 768:
			s += 'min-verification-profile = very_weak'
		elif p['min_dh_size'] <= 1024 or p['min_rsa_size'] <= 1024:
			s += 'min-verification-profile = low'
		elif p['min_dh_size'] <= 2048 or p['min_rsa_size'] <= 2048:
			s += 'min-verification-profile = medium'
		elif p['min_dh_size'] <= 3072 or p['min_rsa_size'] <= 3072:
			s += 'min-verification-profile = high'
		elif p['min_dh_size'] <= 8192 or p['min_rsa_size'] <= 8192:
			s += 'min-verification-profile = ultra'
		else:
			s += 'min-verification-profile = future'

		s += '\n\n'
		s += "[priorities]\nSYSTEM=" + prio + '\n'

		return s

	@classmethod
	def test_config(cls, config):
		if not os.access('/usr/bin/gnutls-cli', os.X_OK):
			return True

		fd, path = mkstemp()

		ret = 255
		try:
			with os.fdopen(fd, 'w') as f:
				f.write(config)
			try:
				os.environ['GNUTLS_SYSTEM_PRIORITY_FILE'] = path
				os.environ['GNUTLS_DEBUG_LEVEL'] = '3'
				os.environ['GNUTLS_SYSTEM_PRIORITY_FAIL_ON_INVALID'] = '1'
				ret = call('/usr/bin/gnutls-cli -l >/dev/null',
					shell=True)
			except CalledProcessError:
				cls.eprint("/usr/bin/gnutls-cli: Execution failed")
		finally:
			del os.environ['GNUTLS_SYSTEM_PRIORITY_FILE']
			del os.environ['GNUTLS_DEBUG_LEVEL']
			del os.environ['GNUTLS_SYSTEM_PRIORITY_FAIL_ON_INVALID']
			os.unlink(path)

		if ret:
			cls.eprint("There is an error in gnutls generated policy")
			cls.eprint("Policy:\n%s" % config)
			return False
		return True
