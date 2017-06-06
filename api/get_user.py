from threading import current_thread
from django.utils.deprecation import MiddlewareMixin

_requests = {}

def get_username():
    t = current_thread()
    print t
    if t not in _requests:
         return None
    return _requests[t]

class RequestMiddleware(MiddlewareMixin):
    def process_request(self, request):
        _requests[current_thread()] = request