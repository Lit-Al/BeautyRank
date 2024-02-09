from rest_framework.permissions import BasePermission


class IsStaffOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.member.exists() and request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        elif user.category_nomination.exists():
            return True
        return False


class IsMemberOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return not request.user.is_staff
