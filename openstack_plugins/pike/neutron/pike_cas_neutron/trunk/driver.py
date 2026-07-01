
from neutron_lib.api.definitions import portbindings
from neutron_lib.callbacks import events
from neutron_lib.callbacks import registry
from neutron_lib import constants
from oslo_config import cfg
from oslo_log import log as logging

from neutron.plugins.ml2.drivers.openvswitch.agent.common import (
    constants as agent_consts)
from neutron.services.trunk import constants as trunk_consts
from neutron.services.trunk.drivers import base
from neutron.services.trunk.drivers.openvswitch import utils

LOG = logging.getLogger(__name__)

NAME = 'casagent'

SUPPORTED_INTERFACES = (
    portbindings.VIF_TYPE_OVS,
    portbindings.VIF_TYPE_VHOST_USER,
)

SUPPORTED_SEGMENTATION_TYPES = (
    trunk_consts.VLAN,
)

DRIVER = None


class CASDriver(base.DriverBase):

    @property
    def is_loaded(self):
        try:
            return NAME in cfg.CONF.ml2.mechanism_drivers
        except cfg.NoSuchOptError:
            return False

    @classmethod
    def create(cls):
        return CASDriver(NAME,
                         SUPPORTED_INTERFACES,
                         SUPPORTED_SEGMENTATION_TYPES,
                         constants.AGENT_TYPE_OVS)


def register():
    """Register the driver."""
    global DRIVER
    DRIVER = CASDriver.create()
    # To set the bridge_name in a parent port's vif_details.
    registry.subscribe(vif_details_bridge_name_handler,
                       agent_consts.OVS_BRIDGE_NAME,
                       events.BEFORE_READ)
    LOG.debug('CAS trunk driver registered')


def vif_details_bridge_name_handler(resource, event, set_br_name, **kwargs):
    """If port is a trunk port, generate a bridge_name for its vif_details."""
    port = kwargs['port']
    if 'trunk_details' in port:
        set_br_name(utils.gen_trunk_br_name(port['trunk_details']['trunk_id']))
