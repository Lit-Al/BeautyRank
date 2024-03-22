# Generated by Django 4.2.3 on 2024-03-22 09:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("events", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="result",
            name="event_staff",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="result",
            name="member_nomination",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="results",
                to="events.membernomination",
            ),
        ),
        migrations.AddField(
            model_name="nominationattribute",
            name="nomination",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="attribute",
                to="events.nomination",
            ),
        ),
        migrations.AddField(
            model_name="membernominationphoto",
            name="member_nomination",
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="photos",
                to="events.membernomination",
            ),
        ),
        migrations.AddField(
            model_name="membernomination",
            name="category_nomination",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="categ",
                to="events.categorynomination",
            ),
        ),
        migrations.AddField(
            model_name="membernomination",
            name="member",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="membernom",
                to="events.member",
            ),
        ),
        migrations.AddField(
            model_name="member",
            name="event",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="members",
                to="events.event",
            ),
        ),
        migrations.AddField(
            model_name="member",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="eventcategory",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="categories_in_EventCategoryModel",
                to="events.category",
            ),
        ),
        migrations.AddField(
            model_name="eventcategory",
            name="event",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT, to="events.event"
            ),
        ),
        migrations.AddField(
            model_name="event",
            name="owners",
            field=models.ManyToManyField(
                blank=True, related_name="owner_events", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="categorynomination",
            name="event_category",
            field=models.ForeignKey(
                default=None,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="events.eventcategory",
            ),
        ),
        migrations.AddField(
            model_name="categorynomination",
            name="event_staff",
            field=models.ManyToManyField(
                blank=True, related_name="staffs", to=settings.AUTH_USER_MODEL
            ),
        ),
        migrations.AddField(
            model_name="categorynomination",
            name="nomination",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="nom",
                to="events.nomination",
            ),
        ),
        migrations.AddConstraint(
            model_name="result",
            constraint=models.UniqueConstraint(
                models.F("member_nomination"),
                models.F("event_staff"),
                name="unique_lower_name_category",
            ),
        ),
    ]