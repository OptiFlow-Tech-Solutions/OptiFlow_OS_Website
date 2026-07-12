from django.db import connection
from django.db.utils import OperationalError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone


@api_view(["GET"])
def health_check(request):
    db_status = "connected"
    try:
        connection.ensure_connection()
    except OperationalError:
        db_status = "disconnected"

    return Response({
        "status": "ok",
        "timestamp": timezone.now().isoformat(),
        "database": db_status,
    })
