#!/usr/bin/env python3
# encoding: utf-8

import os
import sys
import socket
import unittest
import system.audit_domain as domain_login
from management.audit_message import MessageManager

class TestMessageTask(unittest.TestCase):
    msgCls = None
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    def test_message_manager(self):
        try:
            TestMessageTask.msgCls = MessageManager(TestMessageTask.udp_socket)
        except Exception, err:
            print 'test_message_manager failed, errinfo: %s' % str(err) 
            sys.exit(str(err))
             
    def test_vm_login_normal(self):
        domain_login.domain_userlogin(TestMessageTask.msgCls)
        self.assertRaises(Exception)

    def test_vm_login_err(self):
        domain_login.domain_userlogin(None)
        self.assertRaises(Exception)

    def test_close(self):
        TestMessageTask.udp_socket.close()
        self.assertRaises(Exception)


if __name__ == '__main__':
    unittest.main()
