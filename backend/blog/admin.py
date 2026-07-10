from django.contrib import admin

from .models import Article, ArticleCategory, NewsletterSubscriber, Resource


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "order"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ["title", "category", "author", "is_published", "is_featured", "published_at", "view_count"]
    list_filter = ["is_published", "is_featured", "category"]
    search_fields = ["title", "author", "excerpt"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["view_count", "created_at", "updated_at"]
    fieldsets = [
        (None, {"fields": ["title", "slug", "category", "author"]}),
        ("Content", {"fields": ["excerpt", "content"]}),
        ("Metadata", {"fields": ["read_time", "featured_image"]}),
        ("Publishing", {"fields": ["is_featured", "is_published", "published_at"]}),
        ("Stats", {"fields": ["view_count", "created_at", "updated_at"]}),
    ]


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ["title", "file_type", "category", "is_active", "download_count"]
    list_filter = ["is_active", "file_type"]
    search_fields = ["title", "description"]


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ["email", "is_active", "source", "subscribed_at", "unsubscribed_at"]
    list_filter = ["is_active", "source"]
    search_fields = ["email"]
