import pytest
import requests
from django.urls import reverse

from users.models import User


class TestUser:
    @pytest.mark.parametrize(
        "user_data,request_data,check,error_text",
        [
            [
                {"phone_number": "123", "password": "123"},
                {"phone_number": "123", "password": "123"},
                "in",
                None,
            ],
            [
                {"phone_number": "123", "password": "123"},
                {"phone_number": "123", "password": "321"},
                "not in pass",
                "Пароль введен неверно!",
            ],
            [
                {"phone_number": "123", "password": "123"},
                {"phone_number": "321", "password": "123"},
                "not user of num",
                "Пользователь не найден!",
            ],
            [
                {"phone_number": "123", "password": "123"},
                {"phone_number": "", "password": "123"},
                "not num or pas",
                "Не были отправлены номер или пароль!",
            ],
            [
                {"phone_number": "123", "password": "123"},
                {"phone_number": "123", "password": ""},
                "not num or pas",
                "Не были отправлены номер или пароль!",
            ],
        ],
    )
    @pytest.mark.django_db
    def test_authorization(
        self, api_client, user_data, request_data, check, error_text
    ):
        path = reverse("user-check-code")
        data = {
            "phone_number": request_data["phone_number"],
            "password": request_data["password"],
        }

        u = User.objects.create(phone_number=user_data["phone_number"])
        u.set_password(user_data["password"])
        u.save()
        response = api_client.post(path=path, data=data, format="json")

        match check:
            case "in":
                assert "success" in response.data
            case "not in pass":
                assert "success" not in response.data
                assert any([x["detail"] == error_text for x in response.data["errors"]])
            case "not user of num":
                assert "success" not in response.data
                assert any([x["detail"] == error_text for x in response.data["errors"]])
            case "not num or pas":
                assert "success" not in response.data
                assert any([x["detail"] == error_text for x in response.data["errors"]])

    @pytest.mark.parametrize(
        "user_data,request_data,check,error_text",
        [
            [
                {"phone_number": "79008005678"},
                {"phone_number": "321"},
                "not in",
                "Номер телефона введен неверно!",
            ],
            [
                {"phone_number": "79008005678"},
                {"phone_number": "89008005678"},
                "in",
                None,
            ],
            [
                {"phone_number": "79008005678"},
                {"phone_number": "9008005678"},
                "in",
                None,
            ],
            [
                {"phone_number": "79008005678"},
                {"phone_number": "79008005678"},
                "in",
                None,
            ],
            [
                {"phone_number": "79099099090"},
                {"phone_number": "79518125252"},
                "in",
                None,
            ],
        ],
    )
    @pytest.mark.django_db
    def test_input_phone_number_in_existing_user(
        self, api_client, user_data, request_data, check, error_text
    ):
        path = reverse("user-login-in")
        data = {"phone_number": request_data["phone_number"]}

        User.objects.create(phone_number=user_data["phone_number"])
        response = api_client.post(path=path, data=data, format="json")

        match check:
            case "in":
                assert "success" in response.data
            case "not in":
                assert "success" not in response.data
                assert any([x["detail"] == error_text for x in response.data["errors"]])

    # @pytest.mark.parametrize('request_data,check,error_text', [
    #     [ {'phone_number': '79008005678'}, 'in', None],
    #
    # ])
    # @pytest.mark.django_db
    # def test_input_phone_number_in_new_user(self, api_client, request_data, check, error_text):
    #     path = reverse('user-login-in')
    #     data = {'phone_number': request_data['phone_number']}
    #
    #     response = api_client.post(path=path, data=data, format='json')
    #
    #     match check:
    #         case 'in':
    #             assert 'success' in response.data
