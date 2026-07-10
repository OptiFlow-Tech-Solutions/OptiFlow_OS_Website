from django.urls import path

from . import views

urlpatterns = [
    path("articles/", views.article_list, name="article_list"),
    path("articles/popular/", views.article_popular, name="article_popular"),
    path("articles/<slug:slug>/", views.article_detail, name="article_detail"),
    path("resources/", views.resource_list, name="resource_list"),
    path("newsletter/subscribe/", views.newsletter_subscribe, name="newsletter_subscribe"),
    path("newsletter/unsubscribe/", views.newsletter_unsubscribe, name="newsletter_unsubscribe"),
]
