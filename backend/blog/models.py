"""Blog application — articles, categories, resources, and newsletter subscribers."""

import bleach
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


ALLOWED_TAGS = [
    "p", "h2", "h3", "h4", "ul", "ol", "li",
    "strong", "em", "a", "blockquote", "code", "pre", "img", "br",
]
ALLOWED_ATTRS = {"a": ["href", "title"], "img": ["src", "alt"], "code": ["class"]}


class ArticleCategory(models.Model):

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Article Categories"
        ordering = ["order", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Article(models.Model):

    title = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    excerpt = models.TextField(max_length=500, blank=True, default="")
    content = models.TextField()
    category = models.ForeignKey(
        ArticleCategory,
        on_delete=models.PROTECT,
        related_name="articles",
    )
    author = models.CharField(max_length=100)
    read_time = models.PositiveIntegerField(help_text="Estimated read time in minutes")
    featured_image = models.URLField(blank=True, default="")
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def clean(self):
        if self.is_published and not self.published_at:
            raise ValidationError({"published_at": "Published articles must have a publication date."})

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        self.content = bleach.clean(self.content, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, strip=True)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Resource(models.Model):

    FILE_TYPE_CHOICES = [
        ("PDF", "PDF"),
        ("Excel", "Excel"),
        ("Guide", "Guide"),
        ("Template", "Template"),
        ("Toolkit", "Toolkit"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    file_type = models.CharField(max_length=50, choices=FILE_TYPE_CHOICES)
    file_url = models.URLField()
    category = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    download_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class NewsletterSubscriber(models.Model):

    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    source = models.CharField(max_length=50, default="website")
    subscribed_at = models.DateTimeField(default=timezone.now)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-subscribed_at"]

    def __str__(self):
        return self.email
