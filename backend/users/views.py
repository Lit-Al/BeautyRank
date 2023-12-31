import random
from datetime import timedelta

from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import ListModelMixin, UpdateModelMixin, RetrieveModelMixin
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from django.db.models import Q
import smsc_api as sms
from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, UpdateView
from django.contrib import messages
from .models import User
from .forms import UploadImageForm
from .serializer import UserSerializer, LoginSerializer
from rest_framework import viewsets


def check_phone(phone_number: str):
    if len(phone_number) != 11:
        return False
    if not phone_number.isnumeric():
        return False
    if phone_number[0] not in ['7', '8']:
        return False
    return True

class UserViewSet(UpdateModelMixin, RetrieveModelMixin, ListModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'], serializer_class=LoginSerializer)
    def login_in(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.data['phone_number']
        print('LoginInphone:', phone_number)
        if check_phone(phone_number):
            user = User.objects.filter(
                Q(phone_number=phone_number)).first()
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
            print('random_number', random_number)
            user.set_password(random_number)
            # user.expiration_password = timezone.now() + timedelta(days=7)
            user.save()
            # НЕ ЗАБЫТЬ УДАЛИТЬ CODE: RANDOM_NUMBER ИЗ ОТВЕТА НИЖЕ, ОН ТАМ НЕ НУЖЕН, НУЖЕН БЫЛ САШКЕ ДЛЯ РАБОТЫ!!!!!!!
            return Response({'phone_number': phone_number, 'code': random_number})
        return ValidationError(detail='Номер введён неверно', code=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def check_code(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        print('Checkcodephone', phone_number)
        password = request.data.get('code')
        print('CheckcodeFromPostSashi', password)
        user = User.objects.filter(
            Q(phone_number=phone_number) | Q(phone_number=phone_number.replace('8', '7', 1))).first()
        if user is None:
            raise ValidationError(detail='Такого пользователя нет', code=status.HTTP_423_LOCKED)
        if user.check_password(password):
            # if user.expiration_password <= timezone.now():
            #     raise ValidationError(detail='чет случилось')
            login(request, user)

            return Response({'success': 'Успешный вход', 'user': UserSerializer(user).data})
        raise ValidationError(detail='Код введён неверно', code=status.HTTP_400_BAD_REQUEST)

