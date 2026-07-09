from django.contrib import admin
from .models import DemoBooking, Enquiry


@admin.register(DemoBooking)
class DemoBookingAdmin(admin.ModelAdmin):
    list_display = [
        "name", "company", "mobile", "email",
        "preferred_date", "preferred_time_slot", "status",
        "created_at",
    ]
    list_filter = ["status", "preferred_date", "industry", "team_size"]
    search_fields = ["name", "company", "email", "mobile"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ["name", "company", "email", "type", "status", "created_at"]
    list_filter = ["type", "status", "industry", "team_size"]
    search_fields = ["name", "company", "email", "phone"]
    readonly_fields = ["created_at", "updated_at"]
