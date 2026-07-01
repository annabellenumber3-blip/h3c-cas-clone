from nova.objects import origin_fields

for attr in dir(origin_fields):
    if attr not in ['__builtins__', '__file__', '__module__', '__doc__', '__name__', '__package__']:
        globals()[attr] = getattr(origin_fields,attr)

class HypervisorDriver(origin_fields.BaseNovaEnum):
    tuple2list = list(origin_fields.HypervisorDriver.ALL)
    tuple2list.append("casapi")
    ALL = tuple(tuple2list)

class HypervisorDriverField(origin_fields.BaseEnumField):
    AUTO_TYPE = HypervisorDriver()