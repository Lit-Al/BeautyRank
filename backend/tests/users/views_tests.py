import pytest
import requests
from django.urls import reverse

from users.models import User


class TestUser:
    @pytest.mark.parametrize('user_data,request_data,check,error_text', [
        [{'phone_number': '123', 'password': '123'}, {'phone_number': '123', 'password': '123'}, 'in', None],
        [{'phone_number': '123', 'password': '123'}, {'phone_number': '123', 'password': '321'}, 'not in', 'неправильно введен пароль'],
    ])
    @pytest.mark.django_db
    def test_authorization(self, api_client, user_data, request_data, check, error_text):
        path = reverse('user-check-code')
        data = {'phone_number': request_data['phone_number'],  'password': request_data['password']}

        u = User.objects.create(phone_number=user_data['phone_number'])
        u.set_password(user_data['password'])
        u.save()
        response = api_client.post(path=path, data=data, format='json')

        match check:
            case 'in':
                assert 'success' in response.data
            case 'not in':
                assert 'success' not in response.data
                assert any([x['detail'] == 'неправильно введен пароль' for x in response.data['errors']])