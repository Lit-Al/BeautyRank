import requests
from django.conf import settings


def send_sms(phone, random_number):
    """
    Отправка одного сообщения
    :param token: токен авторизации
    :return: id сообщения
    """
    token = None
    try:
        response = requests.post(
            "https://online.sigmasms.ru/api/login",
            json=dict(username=settings.USERNAME_SMSC, password=settings.PASSWORD_SMSC),
        )

        if response and response.status_code == 200:
            token = response.json().get("token")

    except Exception as e:
        raise e

    try:
        response = requests.post(
            "https://online.sigmasms.ru/api/sendings",
            headers=dict(Authorization=token),
            json=dict(
                recipient=phone,
                type="voice",
                payload=dict(
                    # убедитесь, что имя отправителя добавлено в ЛК в разделе Компоненты(https://online.sigmasms.ru/#/components)
                    sender=settings.DEFAULT_SENDER,
                    text=random_number,
                ),
            ),
        )

        if response and response.status_code == 200:
            return response.json().get("id")

    except Exception as e:
        raise e
