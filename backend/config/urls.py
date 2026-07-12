from django.contrib import admin
from django.urls import path, include

from blog import views as blog_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
    path("api/", include("leads.urls")),
    path("api/", include("faq.urls")),
    path("api/", include("blog.urls")),
    path("os/newsletter/<slug:slug>/", blog_views.article_detail_page, name="article_detail_page"),
    path("api/sitemap-articles.xml", blog_views.sitemap_articles, name="sitemap_articles"),
]