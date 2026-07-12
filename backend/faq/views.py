"""FAQ API views."""

from rest_framework import status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import FAQFeedback
from .serializers import FAQFeedbackSerializer


class FAQFeedbackRateThrottle(AnonRateThrottle):
    scope = "faq_feedback"


@api_view(["POST"])
@throttle_classes([FAQFeedbackRateThrottle])
def create_feedback(request):
    serializer = FAQFeedbackSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    feedback = serializer.save()
    return Response(FAQFeedbackSerializer(feedback).data, status=status.HTTP_201_CREATED)
