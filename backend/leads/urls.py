from django.urls import path
from . import views

urlpatterns = [
    path("demo-bookings/", views.create_booking, name="create_booking"),
    path("demo-bookings/slots/", views.available_slots, name="available_slots"),
    path("enquiries/", views.enquiry_handler, name="enquiry_handler"),
]
