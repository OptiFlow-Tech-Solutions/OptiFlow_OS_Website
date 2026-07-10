"""Serializers for the blog app."""

from rest_framework import serializers

from .models import Article, ArticleCategory, NewsletterSubscriber, Resource


class ArticleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleCategory
        fields = ["id", "name", "slug", "description", "order"]


class ArticleListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)

    class Meta:
        model = Article
        fields = [
            "id", "title", "slug", "excerpt", "category_name", "category_slug",
            "author", "read_time", "is_featured", "published_at", "view_count",
        ]


class ArticleDetailSerializer(serializers.ModelSerializer):
    category = ArticleCategorySerializer(read_only=True)

    class Meta:
        model = Article
        fields = [
            "id", "title", "slug", "excerpt", "content", "category",
            "author", "read_time", "featured_image", "published_at",
            "view_count", "created_at", "updated_at",
        ]


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = [
            "id", "title", "description", "file_type", "file_url",
            "category", "download_count",
        ]


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ["email", "source"]
        extra_kwargs = {
            "source": {"required": False, "default": "website"},
            "email": {"validators": []},
        }

    def validate_email(self, value):
        return value.strip().lower()
