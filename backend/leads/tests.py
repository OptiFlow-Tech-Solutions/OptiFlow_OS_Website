from django.core import mail
from django.test import TestCase, override_settings
from rest_framework.test import APIRequestFactory
from . import views


VALID_PAYLOAD = {
    "name": "Rajesh Kumar",
    "company": "Kumar Textiles",
    "phone": "9876543210",
    "email": "rajesh@example.com",
    "team_size": "26–50",
    "industry": "Textile",
    "challenges": "Need better inventory tracking",
}


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class EnquiryAPITests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

    def _post(self, data):
        request = self.factory.post("/api/enquiries/", data, format="json")
        return views.create_enquiry(request)

    def test_valid_submit_returns_201(self):
        response = self._post(VALID_PAYLOAD)
        self.assertEqual(response.status_code, 201)
        self.assertIn("id", response.data)
        self.assertTrue(response.data["id"] > 0)

    def test_missing_name_returns_400(self):
        payload = {**VALID_PAYLOAD, "name": ""}
        response = self._post(payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("name", response.data)

    def test_invalid_phone_returns_400(self):
        payload = {**VALID_PAYLOAD, "phone": "12345"}
        response = self._post(payload)
        self.assertEqual(response.status_code, 400)
        self.assertIn("phone", response.data)

    def test_honeypot_filled_silent_rejection(self):
        payload = {**VALID_PAYLOAD, "_hp": "bot bait"}
        response = self._post(payload)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["id"], 0)

    def test_email_notification_sent(self):
        self._post(VALID_PAYLOAD)
        self.assertEqual(len(mail.outbox), 2)
        # customer email
        self.assertIn(VALID_PAYLOAD["email"], mail.outbox[0].to)
        self.assertIn("received your enquiry", mail.outbox[0].subject)
