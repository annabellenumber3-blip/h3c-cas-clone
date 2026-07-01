from nova.compute import origin_rpcapi

for attr in dir(origin_rpcapi):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_rpcapi,attr)

@profiler.trace_cls("rpc")
class ComputeAPI(origin_rpcapi.ComputeAPI):
    def __init__(self):
        super(ComputeAPI,self).__init__()
    
    def cloud_get_instance_dts_info(self, ctxt, instance):
        version = '4.0'
        cctxt = self.router.client(ctxt).prepare(server=_compute_host(None, instance), version=version)
        return cctxt.call(ctxt, 'cloud_get_instance_dts_info', instance=instance)
