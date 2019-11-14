"""madvisor_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from api.views import home as home_view
from django.contrib.auth.views import password_reset, password_reset_done, password_reset_confirm, password_reset_complete
# from api.helper import obtain_jwt_token_custom
from api.user_helper import myJSONWebTokenSerializer
from rest_framework_jwt.views import ObtainJSONWebToken

# rest_framework
from rest_framework_jwt.views import \
    refresh_jwt_token, \
    obtain_jwt_token, \
    verify_jwt_token


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include('api.urls')),
    url(r'^reset-password/$', password_reset, name='password_reset'),
    url(r'^reset-password/done$', password_reset_done, name='password_reset_done'),
    url(r'^reset-password/confirm/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)$', password_reset_confirm,
        name='password_reset_confirm'),
    url(r'^reset-password/complete', password_reset_complete, name='password_reset_complete'),
    url(r'^api-token-auth/', ObtainJSONWebToken.as_view(serializer_class=myJSONWebTokenSerializer)),
    url(r'^api-token-refresh/', refresh_jwt_token),
    url(r'^api-token-verify/', verify_jwt_token),
    url(r'^', home_view)
]
