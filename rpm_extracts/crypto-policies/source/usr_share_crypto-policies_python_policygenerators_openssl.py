# SPDX-License-Identifier: LGPL-2.1-or-later

# Copyright (c) 2019 Red Hat, Inc.
# Copyright (c) 2019 Tomáš Mráz <tmraz@fedoraproject.org>

from subprocess import check_output, CalledProcessError

from .configgenerator import ConfigGenerator

class OpenSSLGenerator(ConfigGenerator):
	CONFIG_NAME = 'openssl'

	cipher_not_map = {
		'AES-256-CTR':'',
		'AES-128-CTR':'',
		'AES-256-GCM':'-AES256',
		'AES-128-GCM':'-AES128',
		'AES-256-CBC':'-SHA256',
		'AES-128-CBC':'',
		'CHACHA20-POLY1305':'-CHACHA20-POLY1305',
		'SEED-CBC':'-SEED',
		'IDEA-CBC':'!IDEA',
		'DES-CBC':'!DES',
		'RC4-40':'',
		'DES40-CBC':'',
		'3DES-CBC':'-3DES',
		'RC4-128':'!RC4',
		'RC2-CBC':'!RC2',
		'NULL':'!eNULL:!aNULL'
	}

	key_exchange_map = {
		'RSA':'kRSA',
		'ECDHE':'kEECDH',
		'PSK':'kPSK',
		'DHE-PSK':'kDHEPSK',
		'DHE-RSA':'kEDH',
		'DHE-DSS':'',
		'ECDHE-PSK':'kECDHEPSK'
	}

	key_exchange_not_map = {
		'ANON':'',
		'DH':'',
		'ECDH':'',
		'RSA':'-kRSA',
		'ECDHE':'-kEECDH',
		'DHE-RSA':'-aRSA',
		'DHE-DSS':'-aDSS',
		'PSK':'-kPSK',
		'DHE-PSK':'-kDHEPSK',
		'ECDHE-PSK':'-kECDHEPSK'
	}

	mac_not_map = {
		'HMAC-MD5':'!MD5',
		'HMAC-SHA1':'-SHA1'
	}

	ciphersuite_map = {
		'AES-256-GCM':'TLS_AES_256_GCM_SHA384',
		'AES-128-GCM':'TLS_AES_128_GCM_SHA256',
		'CHACHA20-POLY1305':'TLS_CHACHA20_POLY1305_SHA256',
		'AES-128-CCM':'TLS_AES_128_CCM_SHA256',
		'AES-128-CCM8':'TLS_AES_128_CCM_8_SHA256',
	}

	@classmethod
	def generate_ciphers(cls, policy):
		s = ''
		p = policy.props
		ip = policy.inverted_props
		# We cannot separate RSA strength from DH params.
		if p['min_dh_size'] < 1023 or p['min_rsa_size'] < 1023:
			s = cls.append(s, '@SECLEVEL=0')
		elif p['min_dh_size'] < 2048 or p['min_rsa_size'] < 2048:
			s = cls.append(s, '@SECLEVEL=1')
		elif p['min_dh_size'] < 3072 or p['min_rsa_size'] < 3072:
			s = cls.append(s, '@SECLEVEL=2')
		else:
			s = cls.append(s, '@SECLEVEL=3')

		for i in p['key_exchange']:
			try:
				s = cls.append(s, cls.key_exchange_map[i])
			except KeyError:
				pass

		for i in ip['key_exchange']:
			try:
				s = cls.append(s, cls.key_exchange_not_map[i])
			except KeyError:
				pass

		for i in ip['tls_cipher']:
			try:
				s = cls.append(s, cls.cipher_not_map[i])
			except KeyError:
				pass

		for i in ip['mac']:
			try:
				s = cls.append(s, cls.mac_not_map[i])
			except KeyError:
				pass

		# These ciphers are not necessary for any
		# policy level, and only increase the attack surface.
		# FIXME! must be fixed for custom policies
		s = cls.append(s, '-SHA384')
		s = cls.append(s, '-CAMELLIA')
		s = cls.append(s, '-ARIA')
		s = cls.append(s, '-AESCCM8')

		return s

	@classmethod
	def generate_ciphersuites(cls, policy):
		s = ''
		p = policy.props
		for i in p['tls_cipher']:
			try:
				s = cls.append(s, cls.ciphersuite_map[i])
			except KeyError:
				pass

		return s

	@classmethod
	def generate_config(cls, policy):
		return cls.generate_ciphers(policy)

	@classmethod
	def test_config(cls, config):
		output = b''
		try:
			output = check_output(["openssl", "ciphers", config])
		except CalledProcessError:
			cls.eprint("There is an error in openssl generated policy")
			cls.eprint("policy: %s" % config)
			return False
		except OSError:
			# Ignore missing openssl
			return True
		if b'NULL' in output or b'ADH' in output:
			cls.eprint("There is NULL or ADH in openssl generated policy")
			cls.eprint("Policy:\n%s" % config)
			return False
		return True

class OpenSSLConfigGenerator(OpenSSLGenerator):
	CONFIG_NAME = 'opensslcnf'

	TLS_PROTOCOLS = {
		'SSLv3':(3, 0),
		'TLSv1':(3, 1),
		'TLSv1.1':(3, 2),
		'TLSv1.2':(3, 3),
		'TLSv1.3':(3, 4),
	}

	protocol_map = {
			 'SSL3.0':'SSLv3',
			 'TLS1.0':'TLSv1',
			 'TLS1.1':'TLSv1.1',
			 'TLS1.2':'TLSv1.2',
			 'TLS1.3':'TLSv1.3',
			 'DTLS1.0':'DTLSv1',
			 'DTLS1.2':'DTLSv1.2'
	}

	sign_map = {
		'RSA-SHA1':'RSA+SHA1',
		'DSA-SHA1':'DSA+SHA1',
		'ECDSA-SHA1':'ECDSA+SHA1',
		'RSA-SHA2-224':'RSA+SHA224',
		'DSA-SHA2-224':'DSA+SHA224',
		'ECDSA-SHA2-224':'ECDSA+SHA224',
		'RSA-SHA2-256':'RSA+SHA256',
		'DSA-SHA2-256':'DSA+SHA256',
		'ECDSA-SHA2-256':'ECDSA+SHA256',
		'RSA-SHA2-384':'RSA+SHA384',
		'DSA-SHA2-384':'DSA+SHA384',
		'ECDSA-SHA2-384':'ECDSA+SHA384',
		'RSA-SHA2-512':'RSA+SHA512',
		'DSA-SHA2-512':'DSA+SHA512',
		'ECDSA-SHA2-512':'ECDSA+SHA512',
		'RSA-PSS-SHA2-256':'rsa_pss_pss_sha256',
		'RSA-PSS-SHA2-384':'rsa_pss_pss_sha384',
		'RSA-PSS-SHA2-512':'rsa_pss_pss_sha512',
		'RSA-PSS-RSAE-SHA2-256':'rsa_pss_rsae_sha256',
		'RSA-PSS-RSAE-SHA2-384':'rsa_pss_rsae_sha384',
		'RSA-PSS-RSAE-SHA2-512':'rsa_pss_rsae_sha512',
		'EDDSA-ED25519':'ed25519',
		'EDDSA-ED448':'ed448'
	}

	@classmethod
	def generate_config(cls, policy):
		p = policy.props
		s = 'CipherString = '
		# This includes the seclevel
		s += cls.generate_ciphers(policy)
		s += '\n'

		s += 'Ciphersuites = '
		s += cls.generate_ciphersuites(policy)
		s += '\n'

		# Unfortunately there is no practical way to set minimum DTLS version
		s += 'MinProtocol = '
		try:
			s += cls.protocol_map[p['min_tls_version']]
		except KeyError:
			pass
		s += '\n'

		protocol = [cls.protocol_map[i] for i in p['protocol']]
		tls_protocol = [(pp, cls.TLS_PROTOCOLS[pp])
				 for pp in protocol
				 if pp in cls.TLS_PROTOCOLS]
		if tls_protocol:
			tls_protocol.sort(key=lambda x: x[1])
			s += 'MaxProtocol = '
			try:
				s += tls_protocol[-1][0]
			except KeyError:
				pass
			s += '\n'

		sig_algs = [cls.sign_map[i]
				for i in p['sign'] if i in cls.sign_map]
		s += 'SignatureAlgorithms = ' + ':'.join(sig_algs)

		return s

	@classmethod
	def test_config(cls, config):  #pylint: disable=unused-argument
		return True
