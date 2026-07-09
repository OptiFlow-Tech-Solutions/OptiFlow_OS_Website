"""Leads application — demo bookings and contact form submissions."""

from django.db import models
from django.db.models import Q


class DemoBooking(models.Model):
    STATUS_PENDING = "PENDING"
    STATUS_CONFIRMED = "CONFIRMED"
    STATUS_COMPLETED = "COMPLETED"
    STATUS_CANCELLED = "CANCELLED"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    TEAM_SIZE_CHOICES = [
        ("1–10", "1–10"),
        ("11–25", "11–25"),
        ("26–50", "26–50"),
        ("51–100", "51–100"),
        ("101–250", "101–250"),
        ("250+", "250+"),
    ]

    INDUSTRY_CHOICES = [
        ("Textile", "Textile"),
        ("Manufacturing", "Manufacturing"),
        ("Trading", "Trading"),
        ("Warehousing", "Warehousing"),
        ("Distribution", "Distribution"),
        ("Logistics", "Logistics"),
        ("Service", "Service"),
        ("Other", "Other"),
    ]

    WEEKDAY_SLOTS = [
        "9:00 AM", "10:00 AM", "11:00 AM",
        "2:00 PM", "3:00 PM", "4:00 PM",
        "5:00 PM", "6:00 PM", "7:00 PM",
    ]
    SATURDAY_SLOTS = [
        "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM",
    ]

    name = models.CharField(max_length=100)
    company = models.CharField(max_length=200)
    mobile = models.CharField(max_length=15)
    email = models.EmailField()
    team_size = models.CharField(max_length=20, choices=TEAM_SIZE_CHOICES)
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES)
    challenges = models.TextField(blank=True, default="")
    preferred_date = models.DateField()
    preferred_time_slot = models.CharField(max_length=20)
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["preferred_date", "preferred_time_slot"],
                condition=~Q(status="CANCELLED"),
                name="unique_active_booking_per_slot",
            ),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.preferred_date} {self.preferred_time_slot}"
