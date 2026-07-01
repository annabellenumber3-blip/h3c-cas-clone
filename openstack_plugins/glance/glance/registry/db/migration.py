# vim: tabstop=4 shiftwidth=4 softtabstop=4

# Copyright 2011 OpenStack LLC.
# All Rights Reserved.
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

import logging
import os

from migrate.versioning import api as versioning_api
# See LP bug #719834. sqlalchemy-migrate changed location of
# exceptions.py after 0.6.0.
try:
    from migrate.versioning import exceptions as versioning_exceptions
except ImportError:
    from migrate import exceptions as versioning_exceptions
from migrate.versioning import repository as versioning_repository

from glance.common import exception


logger = logging.getLogger('glance.registry.db.migration')


def db_version(conf):
    """
    Return the database's current migration number

    :param conf: conf dict
    :retval version number
    """
    repo_path = get_migrate_repo_path()
    sql_connection = conf.sql_connection
    try:
        return versioning_api.db_version(sql_connection, repo_path)
    except versioning_exceptions.DatabaseNotControlledError as e:
        msg = (_("database '%(sql_connection)s' is not under "
                 "migration control") % locals())
        raise exception.DatabaseMigrationError(msg)


def upgrade(conf, version=None):
    """
    Upgrade the database's current migration level

    :param conf: conf dict
    :param version: version to upgrade (defaults to latest)
    :retval version number
    """
    db_version(conf)  # Ensure db is under migration control
    repo_path = get_migrate_repo_path()
    sql_connection = conf.sql_connection
    version_str = version or 'latest'
    logger.info(_("Upgrading %(sql_connection)s to version %(version_str)s") %
                locals())
    return versioning_api.upgrade(sql_connection, repo_path, version)


def downgrade(conf, version):
    """
    Downgrade the database's current migration level

    :param conf: conf dict
    :param version: version to downgrade to
    :retval version number
    """
    db_version(conf)  # Ensure db is under migration control
    repo_path = get_migrate_repo_path()
    sql_connection = conf.sql_connection
    logger.info(_("Downgrading %(sql_connection)s to version %(version)s") %
                locals())
    return versioning_api.downgrade(sql_connection, repo_path, version)


def version_control(conf, version=None):
    """
    Place a database under migration control

    :param conf: conf dict
    """
    sql_connection = conf.sql_connection
    try:
        _version_control(conf, version)
    except versioning_exceptions.DatabaseAlreadyControlledError as e:
        msg = (_("database '%(sql_connection)s' is already under migration "
               "control") % locals())
        raise exception.DatabaseMigrationError(msg)


def _version_control(conf, version):
    """
    Place a database under migration control

    :param conf: conf dict
    """
    repo_path = get_migrate_repo_path()
    sql_connection = conf.sql_connection
    if version is None:
        version = versioning_repository.Repository(repo_path).latest
    return versioning_api.version_control(sql_connection, repo_path, version)


def db_sync(conf, version=None, current_version=None):
    """
    Place a database under migration control and perform an upgrade

    :param conf: conf dict
    :retval version number
    """
    sql_connection = conf.sql_connection
    repo_path = get_migrate_repo_path()
    latest = versioning_repository.Repository(repo_path).latest

    version = version or latest

    try:
        # Attempt to get migration_repo version.  Should succeed
        # if db was created under version control.
        db_version(conf)
    except exception.DatabaseMigrationError:
        # If it was not created under VC, do nothing until user puts it
        # under VC and sets appropriate version.
        msg = (_("Database '%(sql_connection)s' does not appear to be under "
                 "version control.  Refusing to migrate.  You can enable  "
                 "version control for by using 'glance-manage version_control "
                 " [VERSION #]") % locals())
        raise exception.DatabaseMigrationError(msg)

    # Migrate to the latest
    upgrade(conf, version=version)


def get_migrate_repo_path():
    """Get the path for the migrate repository."""
    path = os.path.join(os.path.abspath(os.path.dirname(__file__)),
                        'migrate_repo')
    assert os.path.exists(path)
    return path
