from io import BytesIO
from os.path import basename

from PIL import Image
from django.contrib.auth.models import AbstractUser
from django.core.files import File
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from RateOnline.storage_backends import PrivateMediaStorage


def optimize_image(user):
    img = Image.open(user.image)
    img = img.resize((150, 150))

    buffer = BytesIO()
    img.save(buffer, format="webp", quality=80, lossless=True)
    user.optimized_image.save(
        "optimized_photo_" + user.image.name[7:], File(buffer), save=False
    )

    user.save()


class User(AbstractUser):
    image = models.ImageField(
        upload_to="images/", null=True, blank=True, storage=PrivateMediaStorage
    )

    optimized_image = models.ImageField(
        upload_to="images/optimized_images/",
        null=True,
        blank=True,
        default=None,
        storage=PrivateMediaStorage,
    )

    phone_number = models.CharField(
        max_length=12,
        help_text="Введите номер телефона пользователя",
        verbose_name="Номер телефона",
    )

    REQUIRED_FIELDS = ["phone_number"]

    class Meta(AbstractUser.Meta):
        pass

    def save(self, *args, **kwargs):
        self.username = self.phone_number
        super().save(*args, **kwargs)

    def __str__(self):
        if not self.last_name or not self.first_name:
            return self.username
        return f"{self.last_name} {self.first_name[0]}."


@receiver(post_save, sender=User)
def make_image_optimized(sender, instance, **kwargs):
    if basename(instance.image.name) != basename(instance.optimized_image.name):
        img = Image.open(instance.image)
        img = img.resize((150, 150))

        buffer = BytesIO()
        img.save(buffer, format="webp", quality=80, lossless=True)
        instance.optimized_image.save(instance.image.name[7:], File(buffer), save=False)

        instance.save()
