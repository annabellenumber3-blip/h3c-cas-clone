#add by zhangmingze, 2014-12-5

from eventlet import event
from eventlet import queue
from eventlet import semaphore
from eventlet import greenthread

class CasSem(object):
    def __init__(self):
        self.stop = False
        self._init_sem_thread()
    
    def _init_sem_thread(self):
        self._sem_queue = queue.LightQueue()
        greenthread.spawn(self._sem_distribute_task)
        
    def _sem_distribute_task(self):
        SemMap = {}
        while not self.stop:
            requestObj = self._sem_queue.get()
            semObj = SemMap.get(requestObj['id'],None)
            action = requestObj['action']
            if action == 'get':
                if not semObj:
                    sem = semaphore.Semaphore()
                    semObj = {'sem':sem,'counts':0}
                    SemMap[requestObj['id']] = semObj
                semObj['counts'] += 1
                requestObj['event'].send(semObj['sem'])
            else:
                if semObj:
                    semObj['counts'] -= 1
                    if semObj['counts'] == 0:
                        del SemMap[requestObj['id']]
        
    def get_obj_sem(self,objId):
        eventObj = event.Event()
        requestObj = {'id':objId,'event':eventObj,'action':'get'}
        self._sem_queue.put(requestObj)
        return eventObj.wait()
    
    def back_obj_sem(self,objId):
        requestObj = {'id':objId,'action':'back'}
        self._sem_queue.put(requestObj)
    
    def __del__(self):
        self.stop = True