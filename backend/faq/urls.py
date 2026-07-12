from django.urls import path
from . import views

urlpatterns = [
    path("faq/feedback/", views.create_feedback, name="create_faq_feedback"),
]
