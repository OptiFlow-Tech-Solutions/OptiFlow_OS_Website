"""FAQ application — feedback tracking for FAQ helpfulness votes."""

from django.db import models


class FAQFeedback(models.Model):
    faq_item_id = models.IntegerField()
    was_helpful = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        helpful = "helpful" if self.was_helpful else "not helpful"
        return f"FAQ #{self.faq_item_id} — {helpful}"
