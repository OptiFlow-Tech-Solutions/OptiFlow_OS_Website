"""Serializers for the leads app."""

import re
from datetime import date, timedelta

from rest_framework import serializers
from .models import DemoBooking, Enquiry


class DemoBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemoBooking
        fields = [
            "id", "name", "company", "mobile", "email",
            "team_size", "industry", "challenges",
            "preferred_date", "preferred_time_slot",
            "status", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at"]

    def validate_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters.")
        if len(value.strip()) > 100:
            raise serializers.ValidationError("Name must be at most 100 characters.")
        return value.strip()

    def validate_company(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Company name must be at least 2 characters.")
        return value.strip()

    def validate_mobile(self, value):
        value = value.strip()
        if not re.match(r"^[6-9]\d{9}$", value):
            raise serializers.ValidationError(
                "Enter a valid Indian mobile number (10 digits, starting with 6-9)."
            )
        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate_team_size(self, value):
        allowed = [choice[0] for choice in DemoBooking.TEAM_SIZE_CHOICES]
        if value not in allowed:
            raise serializers.ValidationError(
                f"Invalid team size. Must be one of: {', '.join(allowed)}"
            )
        return value

    def validate_industry(self, value):
        allowed = [choice[0] for choice in DemoBooking.INDUSTRY_CHOICES]
        if value not in allowed:
            raise serializers.ValidationError(
                f"Invalid industry. Must be one of: {', '.join(allowed)}"
            )
        return value

    def validate_preferred_date(self, value):
        today = date.today()
        tomorrow = today + timedelta(days=1)
        if value < tomorrow:
            raise serializers.ValidationError("Please select a date from tomorrow onward.")
        if value.weekday() >= 6:  # Sunday
            raise serializers.ValidationError("Demos are only available on weekdays and Saturdays.")
        return value

    def validate_preferred_time_slot(self, value):
        return value

    def validate(self, data):
        preferred_date = data.get("preferred_date")
        preferred_time_slot = data.get("preferred_time_slot")

        if preferred_date and preferred_time_slot:
            weekday = preferred_date.weekday()

            if weekday == 5:  # Saturday
                valid_slots = DemoBooking.SATURDAY_SLOTS
            elif weekday < 5:  # Mon-Fri
                valid_slots = DemoBooking.WEEKDAY_SLOTS
            else:  # Sunday (should be caught by date validation)
                valid_slots = []

            if preferred_time_slot not in valid_slots:
                raise serializers.ValidationError({
                    "preferred_time_slot": f"This time slot is not available on {preferred_date.strftime('%A')}s."
                })

            already_booked = DemoBooking.objects.filter(
                preferred_date=preferred_date,
                preferred_time_slot=preferred_time_slot,
            ).exclude(status=DemoBooking.STATUS_CANCELLED).exists()

            if already_booked:
                raise serializers.ValidationError({
                    "preferred_time_slot": "This time slot has already been booked. Please choose another."
                })

        return data


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = [
            "id", "name", "company", "phone", "email",
            "team_size", "industry", "challenges",
            "type", "status", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at"]

    def validate_name(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Name must be at least 3 characters.")
        if len(value.strip()) > 100:
            raise serializers.ValidationError("Name must be at most 100 characters.")
        return value.strip()

    def validate_company(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Company name must be at least 2 characters.")
        return value.strip()

    def validate_phone(self, value):
        value = value.strip()
        if not re.match(r"^[6-9]\d{9}$", value):
            raise serializers.ValidationError(
                "Enter a valid Indian mobile number (10 digits, starting with 6-9)."
            )
        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate_team_size(self, value):
        allowed = [choice[0] for choice in Enquiry._meta.get_field("team_size").choices]
        if value not in allowed:
            raise serializers.ValidationError(
                f"Invalid team size. Must be one of: {', '.join(allowed)}"
            )
        return value

    def validate_industry(self, value):
        allowed = [choice[0] for choice in Enquiry._meta.get_field("industry").choices]
        if value not in allowed:
            raise serializers.ValidationError(
                f"Invalid industry. Must be one of: {', '.join(allowed)}"
            )
        return value

    def validate_type(self, value):
        allowed = [choice[0] for choice in Enquiry.TYPE_CHOICES]
        if value not in allowed:
            raise serializers.ValidationError(
                f"Invalid type. Must be one of: {', '.join(allowed)}"
            )
        return value
