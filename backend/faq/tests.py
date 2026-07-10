"""Tests for the faq app."""

from django.test import TestCase
from rest_framework.test import APIRequestFactory
from rest_framework import status

from .models import FAQFeedback
from .views import create_feedback


class FAQFeedbackModelTest(TestCase):
    def test_create_feedback(self):
        feedback = FAQFeedback.objects.create(faq_item_id=1, was_helpful=True)
        self.assertEqual(feedback.faq_item_id, 1)
        self.assertTrue(feedback.was_helpful)
        self.assertIsNotNone(feedback.created_at)

    def test_unhelpful_feedback(self):
        feedback = FAQFeedback.objects.create(faq_item_id=42, was_helpful=False)
        self.assertFalse(feedback.was_helpful)

    def test_str_representation(self):
        feedback = FAQFeedback.objects.create(faq_item_id=5, was_helpful=True)
        self.assertIn("helpful", str(feedback))


class FAQFeedbackAPITest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.url = "/api/faq/feedback/"

    def test_valid_helpful_feedback(self):
        request = self.factory.post(
            self.url,
            {"faq_item_id": 1, "was_helpful": True},
            format="json",
        )
        response = create_feedback(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["was_helpful"])

    def test_valid_unhelpful_feedback(self):
        request = self.factory.post(
            self.url,
            {"faq_item_id": 5, "was_helpful": False},
            format="json",
        )
        response = create_feedback(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(response.data["was_helpful"])

    def test_negative_faq_item_id_rejected(self):
        request = self.factory.post(
            self.url,
            {"faq_item_id": -1, "was_helpful": True},
            format="json",
        )
        response = create_feedback(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_fields_rejected(self):
        request = self.factory.post(
            self.url,
            {"was_helpful": True},
            format="json",
        )
        response = create_feedback(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_body_rejected(self):
        request = self.factory.post(
            self.url,
            {},
            format="json",
        )
        response = create_feedback(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
