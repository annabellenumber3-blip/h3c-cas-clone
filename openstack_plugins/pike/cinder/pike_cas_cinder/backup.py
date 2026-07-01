from oslo_config import cfg
from oslo_log import log as logging
from cinder.i18n import _

from cinder.backup import driver
from cinder.volume import configuration as config
from cinder.volume.drivers.cas import error as cas_error
from cinder.volume.drivers.cas import volumeops
from cinder.volume.drivers.cas import api

LOG = logging.getLogger(__name__)

cas_default_opts = [
    cfg.StrOpt('cas_host_ip',
               help='IP address for connecting to cas server.'),
    cfg.StrOpt('cas_host_username',
               help='Username for authenticating with cas server.'),
    cfg.StrOpt('cas_host_password',
               help='Password for authenticating with cas server.'),
    cfg.StrOpt('cas_rest_protocol',
               default='http',
               help='the name of protocol to use http or https.'),
    cfg.StrOpt('cas_URI_prefix',
               default='/cas/casrs',
               help='the prefix of URL to assemble rest url address.'),
    cfg.IntOpt('cas_api_retry_count',
               default=10,
               help='Number of times cas server API must be '
                    'retried upon connection related issues.'),
]

cas_backend_opts = [
    cfg.StrOpt('volume_driver',
               help='Driver to use for volume creation'),
    cfg.StrOpt('cas_associate_driver',
               default=None,
               help='which driver will be really used.'),
    cfg.StrOpt('wipe_disks',
               default=False,
               help='wipe data before delete disk'),
]

CONF = cfg.CONF
CONF.register_opts(cas_default_opts)

class CasVolumeBackup(driver.BackupDriver):
    """Provides backup, restore and delete of backup objects within CAS."""

    def __init__(self, context, db_driver=None):
        super(CasVolumeBackup, self).__init__(context, db_driver)
    
    def _get_configuration(self, uuid):
        db_args = self.db.volume_get(self.context,uuid)
        host_info = db_args['host'].split('#')[0]
        backend_info = host_info.split('@')
        if len(backend_info) == 1:
            backend_name = 'DEFAULT'
        else:
            backend_name = backend_info[1]
        
        configuration = config.Configuration(cas_backend_opts,config_group=backend_name)
        
        return configuration
    
    def _check_volume_backup(self, volume_id):
        configuration = self._get_configuration(volume_id)
        
        if configuration.volume_driver != 'cinder.volume.drivers.cas.driver.CasDriver':
            raise Exception(_("CAS volume backup only support CAS volume driver"))
        
        if configuration.cas_associate_driver is not None:
            raise Exception(_("CAS volume backup can't support option cas_associate_driver"))
        
    def _get_backend_volumeops(self):
        host_ip = CONF.cas_host_ip
        username = CONF.cas_host_username
        password = CONF.cas_host_password
        uri_prefix = CONF.cas_URI_prefix
        scheme = CONF.cas_rest_protocol
        api_retry_count = CONF.cas_api_retry_count
        http_log_debug = CONF.debug
        
        if not (host_ip and username and password):
            raise Exception(_("Must specify cas_host_ip, "
                              "cas_host_username "
                              "and cas_host_password to use "
                              "volume_driver=cas.CasDriver"))
        
        if scheme not in ('http','https'):
            raise Exception(_("rest protocol is %s, only support http or https") % scheme)
        
        _session = api.CasAPISession(host_ip,username,password,uri_prefix,api_retry_count,scheme,http_log_debug)
        _volumeops = volumeops.CasVolumeOps(_session)
        
        return _volumeops
    
    def backup(self, backup, volume_file):
        LOG.info(_("[cas::] begin to create backup[%s] from volume[%s]")
                 % (backup['id'],backup['volume_id']))
        self._check_volume_backup(backup['volume_id'])

        backupName = 'backup-' + backup['id']
        volumeName = 'volume-' + backup['volume_id']
        
        volumeops = self._get_backend_volumeops()
        parentId = backup.get('parent_id',None)
        # storageName = None
        # volume_metada = self.db.volume_metadata_get(self.context, backup['volume_id'])
        if parentId:
            hpname = volumeops.check_volume_exist(volumeName)
            if not hpname:
                raise Exception(_("volume[%s] has disappered on the CAS, so unable to backup.") % volumeName)
            volume_info = volumeops.get_volume_info(hpname,volumeName)
            if volume_info.get('volume_format') == 'raw':
                raise Exception(_("CAS volume incremental backup only support qcow2 format but not raw format."))
        
        volumeops.backup_volume(volumeName,backupName,parentId)
        LOG.info(_("[cas::] success to create backup[%s] from volume[%s]")
                 % (backup['id'],backup['volume_id']))
    
    def restore(self, backup, volume_id, volume_file):
        LOG.info(_("[cas::] begin to restore volume[%s] from backup[%s]")
                 % (backup['volume_id'],backup['id']))
        backupName = 'backup-' + backup['id']
        volumeName = 'volume-' + volume_id
        volumeops = self._get_backend_volumeops()
        parentId = backup.get('parent_id',None)
        hpname = volumeops.check_volume_exist(volumeName)
        volume = self.db.volume_get(self.context,volume_id)
        if not hpname:
            raise Exception(_("volume[%s] disapper on the CAS, unable to restore.") % volumeName)
        volume_metada = self.db.volume_metadata_get(self.context,volume_id)
        try:
            config = self._get_configuration(backup['volume_id'])
            wipe_disks = volume_metada.get('wipe_disks') if volume_metada.has_key(
                             'wipe_disks') else config.wipe_disks
        except Exception:
            wipe_disks = volume_metada.get('wipe_disks')
        
        volume_info = volumeops.get_volume_info(hpname,volumeName)
        volumeops.restore_backup(volumeName,backupName,volume['size'],backup['size'],parentId,volume_info.get('mode'),wipe_disks)
    
        LOG.info(_("[cas::] success to restore volume[%s] from backup[%s]")
                 % (backup['volume_id'],backup['id']))
    
    def delete_backup(self, backup):
        LOG.info(_("[cas::] begin to delete backup[%s]") % backup['id'])
        backupName = 'backup-' + backup['id']
        
        backup_metadata = self.db.backup_metadata_get(self.context,backup['id'])
        try:
            config = self._get_configuration(backup['volume_id'])
            wipe_disks = backup_metadata.get('wipe_disks') if backup_metadata.has_key('wipe_disks') else config.wipe_disks
        except Exception:
            wipe_disks = backup_metadata.get('wipe_disks')
        volumeops = self._get_backend_volumeops()
        volumeops.delete_backup(backupName,wipe_disks)
        LOG.info(_("[cas::] success to delete backup[%s]") % backup['id'])
    
def get_backup_driver(context):
    return CasVolumeBackup(context)