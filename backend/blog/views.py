"""Blog API views."""

import logging
from datetime import timedelta

from django.conf import settings
from django.db.models import F
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import Article, ArticleCategory, NewsletterSubscriber, Resource
from .serializers import (
    ArticleDetailSerializer,
    ArticleListSerializer,
    NewsletterSubscriberSerializer,
    ResourceSerializer,
)

logger = logging.getLogger(__name__)


class NewsletterRateThrottle(AnonRateThrottle):
    scope = "newsletter"


# ─── Article endpoints ───


@api_view(["GET"])
def article_list(request):
    queryset = Article.objects.filter(is_published=True).select_related("category")

    category_slug = request.query_params.get("category")
    if category_slug:
        queryset = queryset.filter(category__slug=category_slug)

    queryset = queryset.order_by("-published_at")

    paginator = PageNumberPagination()
    paginator.page_size = 20
    result_page = paginator.paginate_queryset(queryset, request)
    serializer = ArticleListSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view(["GET"])
def article_detail(request, slug):
    article = get_object_or_404(Article, slug=slug, is_published=True)

    Article.objects.filter(pk=article.pk).update(view_count=F("view_count") + 1)
    article.refresh_from_db()

    serializer = ArticleDetailSerializer(article)
    return Response(serializer.data)


@api_view(["GET"])
def article_popular(request):
    thirty_days_ago = timezone.now() - timedelta(days=30)
    queryset = Article.objects.filter(
        is_published=True,
        published_at__gte=thirty_days_ago,
    ).order_by("-view_count")[:6]

    serializer = ArticleListSerializer(queryset, many=True)
    return Response(serializer.data)


# ─── Resource endpoints ───


@api_view(["GET"])
def resource_list(request):
    queryset = Resource.objects.filter(is_active=True).order_by("-created_at")
    serializer = ResourceSerializer(queryset, many=True)
    return Response(serializer.data)


# ─── Newsletter subscriber endpoints ───


@api_view(["POST"])
@throttle_classes([NewsletterRateThrottle])
def newsletter_subscribe(request):
    if request.data.get("_hp", "").strip():
        return Response(
            {"message": "Subscription received"},
            status=status.HTTP_201_CREATED,
        )

    serializer = NewsletterSubscriberSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data["email"]
    source = serializer.validated_data.get("source", "website")

    subscriber, created = NewsletterSubscriber.objects.get_or_create(
        email=email,
        defaults={"source": source, "is_active": True},
    )

    if not created:
        if subscriber.is_active:
            return Response(
                {"email": "This email is already subscribed."},
                status=status.HTTP_409_CONFLICT,
            )
        subscriber.is_active = True
        subscriber.unsubscribed_at = None
        subscriber.source = source
        subscriber.save()

    return Response(
        {"message": "Successfully subscribed!", "email": email},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@throttle_classes([NewsletterRateThrottle])
def newsletter_unsubscribe(request):
    email = request.data.get("email", "").strip().lower()
    if not email:
        return Response(
            {"email": "Email is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        subscriber = NewsletterSubscriber.objects.get(email=email)
    except NewsletterSubscriber.DoesNotExist:
        return Response(
            {"email": "This email is not subscribed."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if not subscriber.is_active:
        return Response(
            {"message": "This email was already unsubscribed."},
            status=status.HTTP_200_OK,
        )

    subscriber.is_active = False
    subscriber.unsubscribed_at = timezone.now()
    subscriber.save()

    return Response(
        {"message": "Successfully unsubscribed."},
        status=status.HTTP_200_OK,
    )


# ─── SEO / Template views ───


def article_detail_page(request, slug):
    article = get_object_or_404(Article, slug=slug, is_published=True)
    site_url = getattr(settings, "SITE_URL", "https://optiflowos.com")
    canonical_url = f"{site_url.rstrip('/')}/os/newsletter/{article.slug}"

    return render(request, "blog/article_detail.html", {
        "article": article,
        "canonical_url": canonical_url,
    })


def sitemap_articles(request):
    articles = Article.objects.filter(is_published=True).only("slug", "updated_at")
    xml = render(request, "blog/sitemap_articles.xml", {"articles": articles})
    xml["Content-Type"] = "application/xml; charset=utf-8"
    return xml
