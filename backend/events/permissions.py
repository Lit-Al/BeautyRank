from events.models import Result
from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsStaffOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        category_nomination = obj.member_nomination.category_nomination
        return category_nomination.event_staff.filter(id=request.user.id).exist()


class IsMemberOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        category_nomination = obj.member_nomination.category_nomination
        return (
            not category_nomination.event_staff.filter(id=request.user.id).exist()
            and obj.member_nomination.member.user == request.user
        )
