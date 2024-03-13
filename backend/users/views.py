from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import RetrieveModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from users.serializer import *
from users.utils import generate_password

from . import smsc_api as sms
from .permissions import IsStaffOnly


class UserViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(
        detail=False,
        methods=["post"],
        serializer_class=LoginSerializer,
        permission_classes=[AllowAny],
    )
    def login_in(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.data["phone_number"]
        if phone_number:
            user = User.objects.filter(Q(phone_number=phone_number)).first()
            if user is None:
                user = User.objects.create(phone_number=phone_number)
            random_number = generate_password()
            # sms.send_sms(phone_number, random_number)
            user.set_password(random_number)
            user.save()
            return Response(
                {
                    "success": "Успешно!",
                    "phone_number": phone_number,
                    "password": random_number,
                }
            )
        return ValidationError(
            detail="Номер введён неверно", code=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=["get", "patch"])
    def me(self, request, *args, **kwargs):
        if request.method == "PATCH":
            serializer = UserSerializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            request.user.refresh_from_db()
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["post"],
        serializer_class=UserIdOfUserSerializer,
        permission_classes=[IsStaffOnly],
    )
    def phone_number_master(self, request, *args, **kwargs):
        serializer = UserIdOfUserSerializer(
            request.user, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        user_id = serializer.validated_data["user_id"]

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = UserSerializer(user)
        return Response(serializer.data)
