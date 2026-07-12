from django.contrib import admin
from .models import FAQFeedback


@admin.register(FAQFeedback)
class FAQFeedbackAdmin(admin.ModelAdmin):
    list_display = ["id", "faq_item_id", "was_helpful", "created_at"]
    list_filter = ["was_helpful", "faq_item_id", "created_at"]
    search_fields = ["faq_item_id"]
    readonly_fields = ["created_at"]
