from django.conf import settings
from telebot import TeleBot


class TelegramIntegration:
    def __init__(self):
        self.telegram = TeleBot(settings.TELEGRAM_SECRET_KEY)

    def send_video_to_telegram_channel(self, instance):
        event = instance.member.event
        category = instance.category_nomination.event_category.category.name
        nomination = instance.category_nomination.nomination.name

        message = self.telegram.send_video(
            settings.TELEGRAM_CHAT_ID,
            instance.url_video,
            caption=f" Мероприятие - {event} \n{nomination} - {category}  \nНомер работы - {instance.id}",
        )
        instance.url_message_video = f"https://t.me/BeautyRankVideo/{message.id}"
        instance.save()
