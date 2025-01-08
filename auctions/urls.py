from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin

urlpatterns = [
    path('', views.AuctionListView.as_view(), name='auction-list'),  # Matches '/api/auctions/'
    path('<int:pk>/', views.AuctionDetailView.as_view(), name='auction-detail'),  # Matches '/api/auctions/<id>/'
    path('bulk_upload/', views.bulk_image_upload, name='bulk_image_upload'),  # Bulk upload functionality
    path('admin/', admin.site.urls),
]

# Add this only in development mode
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)