from io import BytesIO
from os.path import basename

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from RateOnline.storage_backends import PrivateMediaStorage
from users.utils import optimize_image


class User(AbstractUser):
    image = models.ImageField(
        upload_to="images/%Y/%m/%d", null=True, blank=True, storage=PrivateMediaStorage
    )

    optimized_image = models.ImageField(
        upload_to="images/optimized_images/%Y/%m/%d",
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
    if hasattr(instance, "_disable_signal"):
        return

    try:
        is_have_image = bool(instance.image)
        is_have_optimized_image = bool(instance.optimized_image)
        equal_images = False

        if is_have_image and is_have_optimized_image:
            equal_images = basename(instance.image.name) == basename(
                instance.optimized_image.name
            )

        if is_have_image and (not is_have_optimized_image or equal_images is False):
            optimized_image = optimize_image(instance.image, 150)
            if not instance.optimized_image:
                instance.optimized_image = optimized_image
            else:
                instance.optimized_image.save(
                    optimized_image.name, optimized_image, save=False
                )

            instance._disable_signal = True
            instance.save()
            del instance._disable_signal

    except Exception as e:
        print(f"Ошибка во время оптимизации фото: {e}")


@receiver(post_delete, sender=User)
def delete_objects_user(sender, instance, **kwargs):
    if instance.image:
        PrivateMediaStorage().delete(instance.image.name)
    if instance.optimized_image:
        PrivateMediaStorage().delete(instance.optimized_image.name)
