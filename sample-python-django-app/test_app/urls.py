from django.conf.urls import include, url
from dashing.utils import router

from .views import MultipleDashboards

from django.views.generic import RedirectView

urlpatterns = [
    url(r'^$', RedirectView.as_view(url='dashboard/')),
    url(r'^dashboard/', include(router.urls)),
    url(r'^multiple_dashboards/$', MultipleDashboards.as_view()),
]
