"""Serializers for the faq app."""

from rest_framework import serializers
from .models import FAQFeedback


class FAQFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQFeedback
        fields = ["id", "faq_item_id", "was_helpful", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_faq_item_id(self, value):
        if value < 0:
            raise serializers.ValidationError("FAQ item ID must be a non-negative integer.")
        if value > 9999:
            raise serializers.ValidationError("FAQ item ID is too large.")
        return value
