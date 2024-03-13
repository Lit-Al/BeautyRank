from rest_framework.permissions import BasePermission

from events.models import CategoryNomination


class IsStaffOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if CategoryNomination.objects.filter(event_staff=request.user.id).exists():
            return True
        return False
