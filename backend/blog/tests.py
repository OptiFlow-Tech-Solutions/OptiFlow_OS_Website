"""Tests for the blog app."""

from datetime import timedelta

from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIRequestFactory

from .models import Article, ArticleCategory, NewsletterSubscriber, Resource
from .views import (
    article_detail,
    article_list,
    article_popular,
    newsletter_subscribe,
    newsletter_unsubscribe,
    resource_list,
)


# ─── Model tests ───


class ArticleCategoryModelTest(TestCase):
    def test_slug_auto_generated(self):
        cat = ArticleCategory.objects.create(name="Business Systems")
        self.assertEqual(cat.slug, "business-systems")

    def test_unique_name(self):
        ArticleCategory.objects.create(name="Operations")
        with self.assertRaises(Exception):
            ArticleCategory.objects.create(name="Operations")

    def test_default_ordering(self):
        cat3 = ArticleCategory.objects.create(name="C", order=30)
        cat1 = ArticleCategory.objects.create(name="A", order=10)
        cat2 = ArticleCategory.objects.create(name="B", order=20)
        names = list(ArticleCategory.objects.values_list("name", flat=True))
        self.assertEqual(names, ["A", "B", "C"])


class ArticleModelTest(TestCase):
    def setUp(self):
        self.category = ArticleCategory.objects.create(name="Operations")

    def test_slug_auto_generated(self):
        article = Article.objects.create(
            title="How to Reduce Follow-Ups by 80%",
            content="<p>Test content</p>",
            category=self.category,
            author="Priya Sharma",
            read_time=8,
        )
        self.assertEqual(article.slug, "how-to-reduce-follow-ups-by-80")

    def test_published_requires_published_at(self):
        article = Article(
            title="Test Article",
            content="<p>Test</p>",
            category=self.category,
            author="Author",
            read_time=5,
            is_published=True,
        )
        with self.assertRaises(ValidationError):
            article.full_clean()

    def test_html_sanitized_on_save(self):
        article = Article.objects.create(
            title="XSS Test",
            content='<p>Safe</p><script>alert("xss")</script>',
            category=self.category,
            author="Author",
            read_time=5,
            published_at=timezone.now(),
            is_published=True,
        )
        self.assertNotIn("<script>", article.content)
        self.assertIn("<p>Safe</p>", article.content)

    def test_category_protect(self):
        article = Article.objects.create(
            title="Protected Article",
            content="<p>Content</p>",
            category=self.category,
            author="Author",
            read_time=5,
            published_at=timezone.now(),
            is_published=True,
        )
        with self.assertRaises(Exception):
            self.category.delete()


class NewsletterSubscriberModelTest(TestCase):
    def test_unique_email(self):
        NewsletterSubscriber.objects.create(email="user@example.com")
        with self.assertRaises(Exception):
            NewsletterSubscriber.objects.create(email="user@example.com")

    def test_unsubscribe_preserves_record(self):
        sub = NewsletterSubscriber.objects.create(email="leave@example.com")
        self.assertTrue(sub.is_active)
        self.assertIsNone(sub.unsubscribed_at)

        sub.is_active = False
        sub.unsubscribed_at = timezone.now()
        sub.save()

        self.assertFalse(sub.is_active)
        self.assertIsNotNone(sub.unsubscribed_at)
        self.assertTrue(NewsletterSubscriber.objects.filter(email="leave@example.com").exists())


class ResourceModelTest(TestCase):
    def test_valid_file_type(self):
        resource = Resource.objects.create(
            title="Test Resource",
            description="A test resource",
            file_type="PDF",
            file_url="https://example.com/test.pdf",
            category="Operations",
        )
        self.assertEqual(resource.file_type, "PDF")

    def test_default_is_active(self):
        resource = Resource.objects.create(
            title="Active Resource",
            description="Should be active by default",
            file_type="Guide",
            file_url="https://example.com/guide.pdf",
            category="Operations",
        )
        self.assertTrue(resource.is_active)


# ─── API tests ───


class BlogAPITestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.cat1 = ArticleCategory.objects.create(name="Operations", order=1)
        self.cat2 = ArticleCategory.objects.create(name="Leadership", order=2)

        now = timezone.now()
        self.article1 = Article.objects.create(
            title="Published Article One",
            excerpt="Excerpt one",
            content="<p>Content of article one</p>",
            category=self.cat1,
            author="Author One",
            read_time=5,
            is_published=True,
            published_at=now - timedelta(days=2),
            view_count=100,
        )
        self.article2 = Article.objects.create(
            title="Published Article Two",
            excerpt="Excerpt two",
            content="<p>Content of article two</p>",
            category=self.cat2,
            author="Author Two",
            read_time=10,
            is_published=True,
            published_at=now - timedelta(days=1),
            view_count=200,
        )
        self.draft = Article.objects.create(
            title="Draft Article",
            content="<p>Draft content</p>",
            category=self.cat1,
            author="Author Draft",
            read_time=3,
            is_published=False,
        )
        self.old_article = Article.objects.create(
            title="Old Popular Article",
            excerpt="Old but popular",
            content="<p>Old content</p>",
            category=self.cat1,
            author="Old Author",
            read_time=7,
            is_published=True,
            published_at=now - timedelta(days=40),
            view_count=500,
        )

        self.resource = Resource.objects.create(
            title="Sample Resource",
            description="A sample resource",
            file_type="PDF",
            file_url="https://example.com/sample.pdf",
            category="Operations",
            is_active=True,
        )
        self.inactive_resource = Resource.objects.create(
            title="Inactive Resource",
            description="Should not appear",
            file_type="Excel",
            file_url="https://example.com/inactive.xlsx",
            category="Operations",
            is_active=False,
        )


class ArticleListAPITest(BlogAPITestCase):
    def test_list_paginated(self):
        request = self.factory.get("/api/articles/")
        response = article_list(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn("results", data)
        self.assertEqual(data["count"], 3)  # published only (article1, article2, old_article)
        self.assertEqual(len(data["results"]), 3)

    def test_list_excludes_drafts(self):
        request = self.factory.get("/api/articles/")
        response = article_list(request)
        slugs = [a["slug"] for a in response.data["results"]]
        self.assertIn(self.article1.slug, slugs)
        self.assertIn(self.article2.slug, slugs)
        self.assertNotIn(self.draft.slug, slugs)

    def test_filter_by_category(self):
        request = self.factory.get("/api/articles/?category=operations")
        response = article_list(request)
        self.assertEqual(response.data["count"], 2)  # cat1 has article1 + old_article
        self.assertEqual(response.data["results"][0]["slug"], self.article1.slug)

    def test_filter_by_nonexistent_category(self):
        request = self.factory.get("/api/articles/?category=nonexistent")
        response = article_list(request)
        self.assertEqual(response.data["count"], 0)

    def test_ordered_by_published_at_desc(self):
        request = self.factory.get("/api/articles/")
        response = article_list(request)
        slugs = [a["slug"] for a in response.data["results"]]
        self.assertEqual(slugs[0], self.article2.slug)  # more recent
        self.assertEqual(slugs[1], self.article1.slug)


class ArticleDetailAPITest(BlogAPITestCase):
    def test_detail_returns_full_article(self):
        request = self.factory.get(f"/api/articles/{self.article1.slug}/")
        response = article_detail(request, slug=self.article1.slug)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Published Article One")
        self.assertIn("content", response.data)
        self.assertIn("category", response.data)
        self.assertEqual(response.data["category"]["name"], "Operations")

    def test_draft_returns_404(self):
        request = self.factory.get(f"/api/articles/{self.draft.slug}/")
        response = article_detail(request, slug=self.draft.slug)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_nonexistent_slug_returns_404(self):
        request = self.factory.get("/api/articles/no-such-article/")
        response = article_detail(request, slug="no-such-article")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_view_count_increments(self):
        original_count = self.article1.view_count
        request = self.factory.get(f"/api/articles/{self.article1.slug}/")
        response = article_detail(request, slug=self.article1.slug)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.article1.refresh_from_db()
        self.assertEqual(self.article1.view_count, original_count + 1)


class ArticlePopularAPITest(BlogAPITestCase):
    def test_popular_sorted_by_views(self):
        request = self.factory.get("/api/articles/popular/")
        response = article_popular(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertGreaterEqual(len(data), 1)
        views = [a["view_count"] for a in data]
        self.assertEqual(views, sorted(views, reverse=True))

    def test_popular_excludes_old_articles(self):
        request = self.factory.get("/api/articles/popular/")
        response = article_popular(request)
        slugs = [a["slug"] for a in response.data]
        self.assertNotIn(self.old_article.slug, slugs)

    def test_popular_max_6(self):
        request = self.factory.get("/api/articles/popular/")
        response = article_popular(request)
        self.assertLessEqual(len(response.data), 6)


class ResourceListAPITest(BlogAPITestCase):
    def test_active_resources_returned(self):
        request = self.factory.get("/api/resources/")
        response = resource_list(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Sample Resource")

    def test_inactive_resources_excluded(self):
        request = self.factory.get("/api/resources/")
        response = resource_list(request)
        titles = [r["title"] for r in response.data]
        self.assertNotIn("Inactive Resource", titles)


class NewsletterSubscribeAPITest(TestCase):
    def test_valid_subscription(self):
        request = APIRequestFactory().post(
            "/api/newsletter/subscribe/",
            {"email": "user@example.com", "source": "blog"},
            format="json",
        )
        response = newsletter_subscribe(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(NewsletterSubscriber.objects.filter(email="user@example.com").exists())

    def test_honeypot_silently_accepts(self):
        request = APIRequestFactory().post(
            "/api/newsletter/subscribe/",
            {"email": "bot@spam.com", "_hp": "gotcha"},
            format="json",
        )
        response = newsletter_subscribe(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(NewsletterSubscriber.objects.filter(email="bot@spam.com").exists())

    def test_duplicate_email_returns_409(self):
        NewsletterSubscriber.objects.create(email="exists@example.com")
        request = APIRequestFactory().post(
            "/api/newsletter/subscribe/",
            {"email": "exists@example.com"},
            format="json",
        )
        response = newsletter_subscribe(request)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_invalid_email_returns_400(self):
        request = APIRequestFactory().post(
            "/api/newsletter/subscribe/",
            {"email": "not-an-email"},
            format="json",
        )
        response = newsletter_subscribe(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_email_returns_400(self):
        request = APIRequestFactory().post(
            "/api/newsletter/subscribe/",
            {"source": "blog"},
            format="json",
        )
        response = newsletter_subscribe(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reactivate_unsubscribed_email(self):
        sub = NewsletterSubscriber.objects.create(
            email="return@example.com",
            is_active=False,
            unsubscribed_at=timezone.now(),
        )
        request = APIRequestFactory().post(
            "/api/newsletter/subscribe/",
            {"email": "return@example.com"},
            format="json",
        )
        response = newsletter_subscribe(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        sub.refresh_from_db()
        self.assertTrue(sub.is_active)
        self.assertIsNone(sub.unsubscribed_at)


class NewsletterUnsubscribeAPITest(TestCase):
    def setUp(self):
        self.sub = NewsletterSubscriber.objects.create(email="unsub@example.com")

    def test_active_subscriber_unsubscribes(self):
        request = APIRequestFactory().post(
            "/api/newsletter/unsubscribe/",
            {"email": "unsub@example.com"},
            format="json",
        )
        response = newsletter_unsubscribe(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.sub.refresh_from_db()
        self.assertFalse(self.sub.is_active)
        self.assertIsNotNone(self.sub.unsubscribed_at)

    def test_unknown_email_returns_404(self):
        request = APIRequestFactory().post(
            "/api/newsletter/unsubscribe/",
            {"email": "unknown@example.com"},
            format="json",
        )
        response = newsletter_unsubscribe(request)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_already_unsubscribed_returns_200(self):
        self.sub.is_active = False
        self.sub.unsubscribed_at = timezone.now()
        self.sub.save()

        request = APIRequestFactory().post(
            "/api/newsletter/unsubscribe/",
            {"email": "unsub@example.com"},
            format="json",
        )
        response = newsletter_unsubscribe(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_missing_email_returns_400(self):
        request = APIRequestFactory().post(
            "/api/newsletter/unsubscribe/",
            {},
            format="json",
        )
        response = newsletter_unsubscribe(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
