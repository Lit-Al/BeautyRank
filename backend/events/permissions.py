from rest_framework.permissions import BasePermission

from events.models import MemberNomination


class IsStaffOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return MemberNomination.objects.filter(
            id=request.data["member_nomination"],
            category_nomination__event_staff=request.user.id,
        ).exists()


class IsMemberOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return MemberNomination.objects.filter(
            id=request.data["member_nomination"], member__user=request.user.id
        ).exists()


class TelegramBotUpdate(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        if request.data.get("user", "client") == "telegram":
            return True
        return False
