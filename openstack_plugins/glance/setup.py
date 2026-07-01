# setup.py

import os
from setuptools import setup, find_packages

__version__ = '1.0' # 版本号


setup(
    name = 'cas_glance', # 在pip中显示的项目名称
    version = __version__,
    author = 'CAS',
    author_email = '',
    url = '',
    description = '',
    packages = find_packages(exclude=["tests"]), # 项目中需要拷贝到指定路径的文件夹
    python_requires = '>=3.5.0'
        )

