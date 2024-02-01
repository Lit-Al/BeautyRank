import random
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import ListModelMixin, UpdateModelMixin, RetrieveModelMixin
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from django.db.models import Q
from .serializer import *
from rest_framework import viewsets


def check_phone(phone_number: str):
    if len(phone_number) != 11:
        return False
    if not phone_number.isnumeric():
        return False
    if phone_number[0] not in ["7", "8"]:
        return False
    return True


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
        if check_phone(phone_number):
            user = User.objects.filter(Q(phone_number=phone_number)).first()
            if user is None:
                user = User.objects.create(phone_number=phone_number)
            name_user = user.first_name
            random_number = str(random.randint(1000, 9999))
            # token = sms.get_token()
            # print('token=', token)
            # message_id = sms.send_sms(token, phone_number, random_number, name_user)
            # print('message_id=', message_id)
            # status_sms = sms.check_status(token, message_id)
            # print('status_sms=' + status_sms)
            user.set_password(random_number)
            # user.expiration_password = timezone.now() + timedelta(days=7)
            user.save()
            # НЕ ЗАБЫТЬ УДАЛИТЬ PASSWORD И PHONE_NUMBER ИЗ ОТВЕТА НИЖЕ, ОНИ ТАМ НЕ НУЖНЫ, НУЖНЫ БЫЛИ САШКЕ ДЛЯ РАБОТЫ!!!!!!!
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

    @action(
        detail=False, methods=["get", "patch"], permission_classes=[IsAuthenticated]
    )
    def me(self, request, *args, **kwargs):
        if request.method == "PATCH":
            serializer = UserSerializer(request.user, data=request.data, partial=True)
            serializer.is_valid()
            serializer.save()
            request.user.refresh_from_db()
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
