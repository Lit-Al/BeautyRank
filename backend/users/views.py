import random

from rest_framework.decorators import api_view
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
from .serializer import UserSerializer
from rest_framework import viewsets


def check_phone(phone_number: str):
    if len(phone_number) != 11:
        return False
    if not phone_number.isnumeric():
        return False
    if phone_number[0] not in ['7', '8']:
        return False
    return True

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        pass

    @action(detail=False, methods=['post'])
    def login_in(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        print('LoginInphone:', phone_number)
        if check_phone(phone_number):
            try:
                user = User.objects.filter(
                    Q(phone_number=phone_number) | Q(phone_number=phone_number.replace('8', '7', 1))).first()
            except:
                return Response({'error': 'Такого пользователя нет'})

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
            user.save()
            # НЕ ЗАБЫТЬ УДАЛИТЬ CODE: RANDOM_NUMBER ИЗ ОТВЕТА НИЖЕ, ОН ТАМ НЕ НУЖЕН НУЖЕН БЫЛ САШКЕ ДЛЯ РАБОТЫ!!!!!!!
            return Response({'phone_number': phone_number, 'code': random_number})

        return Response({'error': 'Номер введён неверно'})

    @action(detail=False, methods=['post'])
    def check_code(self, request, *args, **kwargs):
        phone_number = request.data.get('phone_number')
        print('Checkcodephone', phone_number)
        password = request.data.get('code')
        print('CheckcodeFromPostSashi', password)
        user = User.objects.filter(
            Q(phone_number=phone_number) | Q(phone_number=phone_number.replace('8', '7', 1))).first()
        if user is None:
            return Response({'error': 'Такого пользователя нет'})
        if user.check_password(password):
            login(request, user)

            return Response({'success': 'Успешный вход', 'user': UserSerializer(user).data})
        return Response({'error': 'Код введён неверно'})

    def photo_selection(self, request, pk=None):
        instance = self.get_object()
        serializer = UserSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

