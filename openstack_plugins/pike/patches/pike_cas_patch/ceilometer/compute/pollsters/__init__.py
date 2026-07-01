from ceilometer.compute.pollsters import origin_init

for attr in dir(origin_init):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_init,attr)

class GenericComputePollster(origin_init.GenericComputePollster):
    GenericComputePollster._inspectors = {}

    def setup_inspector(self, uuid):
        try:
            self.inspector = GenericComputePollster._inspectors[uuid]
        except KeyError:
            self.inspector = virt_inspector.get_hypervisor_inspector(self.conf)
            GenericComputePollster._inspectors[uuid] = self.inspector
