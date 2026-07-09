"""Leads API views."""

import logging
from datetime import date, datetime

from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction, IntegrityError
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import DemoBooking
from .serializers import DemoBookingSerializer

logger = logging.getLogger(__name__)


@api_view(["POST"])
def create_booking(request):
    if request.data.get("_hp", "").strip():
        return Response({"id": 0, "message": "Booking received"}, status=status.HTTP_201_CREATED)

    serializer = DemoBookingSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            booking = serializer.save()

            try:
                _send_customer_email(booking)
            except Exception:
                logger.exception("Failed to send customer confirmation for booking %s", booking.id)

            try:
                _send_admin_email(booking)
            except Exception:
                logger.exception("Failed to send admin notification for booking %s", booking.id)

    except IntegrityError:
        return Response(
            {"preferred_time_slot": "This time slot has just been booked. Please choose another."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(DemoBookingSerializer(booking).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def available_slots(request):
    date_str = request.query_params.get("date")
    if not date_str:
        return Response(
            {"error": "Missing date parameter. Use ?date=YYYY-MM-DD"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        selected_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return Response(
            {"error": "Invalid date format. Use YYYY-MM-DD."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    weekday = selected_date.weekday()
    if weekday == 6:  # Sunday
        return Response([], status=status.HTTP_200_OK)
    elif weekday == 5:  # Saturday
        all_slots = DemoBooking.SATURDAY_SLOTS
    else:
        all_slots = DemoBooking.WEEKDAY_SLOTS

    booked_slots = DemoBooking.objects.filter(
        preferred_date=selected_date,
    ).exclude(status=DemoBooking.STATUS_CANCELLED).values_list("preferred_time_slot", flat=True)

    available = [slot for slot in all_slots if slot not in booked_slots]
    return Response(available, status=status.HTTP_200_OK)


def _send_customer_email(booking):
    subject = "Demo Request Received — OptiFlow OS"
    body = (
        f"Hi {booking.name},\n\n"
        f"Thank you for booking a demo with OptiFlow OS!\n\n"
        f"Your demo is scheduled for:\n"
        f"  Date: {booking.preferred_date.strftime('%A, %d %B %Y')}\n"
        f"  Time: {booking.preferred_time_slot} (IST)\n\n"
        f"We'll contact you within one business day to confirm the details "
        f"and tailor the demo to your industry ({booking.industry}).\n\n"
        f"If you have any questions, reply to this email or call us.\n\n"
        f"— The OptiFlow OS Team\n"
    )
    send_mail(
        subject,
        body,
        settings.DEFAULT_FROM_EMAIL,
        [booking.email],
        fail_silently=False,
    )


def _send_admin_email(booking):
    notify_email = getattr(settings, "DEMO_BOOKING_NOTIFY_EMAIL", None)
    if not notify_email:
        return

    subject = f"New Demo Booking — {booking.name} ({booking.company})"
    body = (
        f"New demo booking received:\n\n"
        f"  Name: {booking.name}\n"
        f"  Company: {booking.company}\n"
        f"  Mobile: {booking.mobile}\n"
        f"  Email: {booking.email}\n"
        f"  Team Size: {booking.team_size}\n"
        f"  Industry: {booking.industry}\n"
        f"  Date: {booking.preferred_date.strftime('%A, %d %B %Y')}\n"
        f"  Time: {booking.preferred_time_slot}\n"
        f"  Challenges: {booking.challenges or 'None provided'}\n\n"
        f"Manage: {settings.SITE_URL or ''}/admin/leads/demobooking/{booking.id}/\n"
    )
    send_mail(
        subject,
        body,
        settings.DEFAULT_FROM_EMAIL,
        [notify_email],
        fail_silently=False,
    )
