# Generated by Django 4.2.3 on 2024-04-30 07:26

from django.db import migrations, models

import RateOnline.storage_backends


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_alter_user_phone_number"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="optimized_image",
            field=models.ImageField(
                blank=True,
                default=None,
                null=True,
                storage=RateOnline.storage_backends.PrivateMediaStorage,
                upload_to="images/optimized_images/",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="image",
            field=models.ImageField(
                blank=True,
                null=True,
                storage=RateOnline.storage_backends.PrivateMediaStorage,
                upload_to="images/",
            ),
        ),
    ]
