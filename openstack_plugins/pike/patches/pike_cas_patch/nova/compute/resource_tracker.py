from nova.compute import origin_resource_tracker

for attr in dir(origin_resource_tracker):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_resource_tracker,attr)

class ComputeNodes(object):
    nodename = None
    def __init__(self):
        self.compute_nodes = {}

    def __getitem__(self, nodename):
        ComputeNodes.nodename = nodename
        return self.compute_nodes.get(nodename, None)

    def __setitem__(self, nodename, value):
        ComputeNodes.nodename = nodename
        self.compute_nodes[nodename] = value

    def __getattr__(self, attr):
        return getattr(self.compute_nodes, attr)

    def __iter__(self):
        return iter(self.compute_nodes)

class ResourceTracker(origin_resource_tracker.ResourceTracker):
    def __init__(self, host, driver):
        self.pci_rt = {}
        super(ResourceTracker,self).__init__(host, driver)
        self.compute_nodes = ComputeNodes()

    @property
    def pci_tracker(self):
        return self.pci_rt.get(ComputeNodes.nodename, None)

    @pci_tracker.setter
    def pci_tracker(self, pci_rt):
        self.pci_rt[ComputeNodes.nodename] = pci_rt