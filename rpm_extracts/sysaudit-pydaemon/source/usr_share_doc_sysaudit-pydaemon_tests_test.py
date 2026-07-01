import os
import sys
import unittest

sys.path.append('/usr/lib/python3.9/dist-packages/sysaudit')

if __name__ == '__main__':
    testdir = os.path.join(os.getcwd())

    discover = unittest.defaultTestLoader.discover(testdir, 
               pattern = 'test_*.py')

    runner = unittest.TextTestRunner()

    runner.run(discover)
