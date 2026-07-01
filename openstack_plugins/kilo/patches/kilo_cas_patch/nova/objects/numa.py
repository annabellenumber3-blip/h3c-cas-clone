from nova.objects import origin_numa

for attr in dir(origin_numa):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_numa,attr)

if hasattr(base,'NovaObjectRegistry'):
    @base.NovaObjectRegistry.register
    class NUMACell(origin_numa.NUMACell):
        def pin_cpus(self, cpus, *args, **kwargs):
            try:
                super(NUMACell,self).pin_cpus(cpus,*args,**kwargs)
            except exception.CPUPinningInvalid:
                self.pinned_cpus |= cpus

        def unpin_cpus(self, cpus, *args, **kwargs):
            try:
                super(NUMACell,self).unpin_cpus(cpus,*args,**kwargs)
            except exception.CPUPinningInvalid:
                self.pinned_cpus -= cpus
else:
    class NUMACell(origin_numa.NUMACell):
        def pin_cpus(self, cpus, *args, **kwargs):
            try:
                super(NUMACell,self).pin_cpus(cpus,*args,**kwargs)
            except exception.CPUPinningInvalid:
                self.pinned_cpus |= cpus

        def unpin_cpus(self, cpus, *args, **kwargs):
            try:
                super(NUMACell,self).unpin_cpus(cpus,*args,**kwargs)
            except exception.CPUPinningInvalid:
                self.pinned_cpus -= cpus
