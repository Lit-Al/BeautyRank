from django.db import models
from django.db.models import Count, Sum, constraints
from django.db.models.signals import post_save
from django.dispatch import receiver

from integrations.telegram import TelegramIntegration


class Category(models.Model):
    name = models.CharField(
        max_length=10,
        help_text="Введите название категории",
        verbose_name="Название категории",
    )

    description = models.TextField(
        max_length=100,
        help_text="Введите описание категории",
        verbose_name="Описание категории",
    )

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name


class Nomination(models.Model):
    name = models.CharField(
        max_length=50,
        help_text="Введите название номинации",
        verbose_name="Название номинации",
    )

    photos_conf = models.JSONField(default=dict)

    def get_photo_count(self):
        return len(self.photos_conf["before"]) + len(self.photos_conf["after"])

    class Meta:
        verbose_name = "Номинация"
        verbose_name_plural = "Номинации"
        ordering = ["id"]

    def __str__(self):
        return self.name


class NominationAttribute(models.Model):
    name = models.CharField(max_length=150)
    nomination = models.ForeignKey(
        "Nomination", models.PROTECT, related_name="attribute"
    )
    max_score = models.IntegerField(default=5)

    def __str__(self):
        return self.name


class Event(models.Model):
    name = models.CharField(
        max_length=50,
        help_text="Введите название мероприятия",
        verbose_name="Название мероприятия",
    )
    image = models.ImageField()
    owners = models.ManyToManyField(
        "users.User", blank=True, related_name="owner_events"
    )

    class Meta:
        verbose_name = "Мероприятие"
        verbose_name_plural = "Мероприятия"

    def get_winners_nominations(self):
        win_nominations = []
        category_nominations = CategoryNomination.objects.filter(
            event_category__event=self.id
        )
        for category_nomination in category_nominations:
            member_nominations = MemberNomination.objects.filter(
                category_nomination=category_nomination
            )
            members = set(member_nominations.values_list("member", flat=True))
            top = []
            members_in_current_event = Member.objects.filter(event=self.id)

            for member in members:
                result_all = sum(
                    Result.objects.filter(
                        member_nomination__member=member,
                        member_nomination__category_nomination=category_nomination,
                    ).values_list("score", flat=True)
                )
                top.append(
                    {
                        "member": members_in_current_event.get(pk=member),
                        "result_all": result_all,
                    }
                )
            top = sorted(top, reverse=True, key=lambda x: x["result_all"])
            win_nominations.append(
                {"name": str(category_nomination.nomination), "members": top}
            )
        return win_nominations

    def get_winners_categories(self):
        win_categories = []
        categories = Category.objects.filter(
            categories_in_EventCategoryModel__event=self.id
        )
        for category in categories:
            member_nominations = MemberNomination.objects.filter(
                category_nomination__event_category__category=category
            )
            members = set(member_nominations.values_list("member", flat=True))
            top = []
            members_in_current_event = Member.objects.filter(event=self.id)
            for member in members:
                result_all = sum(
                    Result.objects.filter(
                        member_nomination__member=member,
                        member_nomination__category_nomination__event_category__category=category,
                    ).values_list("score", flat=True)
                )
                top.append(
                    {
                        "member": members_in_current_event.get(pk=member),
                        "result_all": result_all,
                    }
                )
            top = sorted(top, reverse=True, key=lambda x: x["result_all"])
            win_categories.append({"name": str(category), "members": top})
        return win_categories

    def __str__(self):
        return self.name


class Member(models.Model):
    user = models.ForeignKey("users.User", models.PROTECT)
    event = models.ForeignKey("Event", models.PROTECT, related_name="members")

    class Meta:
        verbose_name = "Участник"
        verbose_name_plural = "Участники"

    def __str__(self) -> str:
        return f"Участник {self.user} --- {self.event}"


class EventCategory(models.Model):
    event = models.ForeignKey("Event", models.PROTECT)
    category = models.ForeignKey(
        "Category", models.PROTECT, related_name="categories_in_EventCategoryModel"
    )

    class Meta:
        verbose_name = "Категории мероприятия"
        verbose_name_plural = "Категории мероприятий"

    def __str__(self) -> str:
        return f"{self.event} --- {self.category}"


class CategoryNomination(models.Model):
    event_category = models.ForeignKey("EventCategory", models.PROTECT)
    nomination = models.ForeignKey("Nomination", models.PROTECT, related_name="nom")
    event_staff = models.ManyToManyField(
        "users.User", blank=True, related_name="staffs"
    )

    class Meta:
        verbose_name = "Номинации категорий"
        verbose_name_plural = "Номинации категорий"

    def __str__(self) -> str:
        return f"{self.event_category} --- {self.nomination}"


class MemberNomination(models.Model):
    member = models.ForeignKey("Member", models.PROTECT, related_name="membernom")
    category_nomination = models.ForeignKey(
        "CategoryNomination", models.PROTECT, related_name="categ"
    )
    url_video = models.TextField(default="", blank=True)
    url_message_video = models.TextField(default="", blank=True)

    class Meta:
        verbose_name = "Номинация участника"
        verbose_name_plural = "Номинации участника"

    # @property
    # def is_done(self):
    #     count_referee = self.category_nomination.staffs.count()
    #     count_results = self.results.count()
    #     return count_results == count_referee

    def __str__(self) -> str:
        return f"{self.member} --- {self.category_nomination}"


class MemberNominationPhoto(models.Model):
    BEFORE = "BE"
    AFTER = "AF"
    BEFORE_AFTER_CHOICES = [
        (BEFORE, "До"),
        (AFTER, "После"),
    ]

    member_nomination = models.ForeignKey(
        "MemberNomination", models.PROTECT, related_name="photos", default=None
    )
    photo = models.ImageField()
    name = models.CharField(
        max_length=50,
        help_text="Введите название фотографии",
        verbose_name="Название фотографии",
    )
    before_after = models.CharField(max_length=2, choices=BEFORE_AFTER_CHOICES)

    def __str__(self) -> str:
        return f"{self.member_nomination}"


class Result(models.Model):
    member_nomination = models.ForeignKey(
        "MemberNomination", models.PROTECT, related_name="results"
    )
    score = models.IntegerField()
    event_staff = models.ForeignKey("users.User", models.PROTECT)
    score_retail = models.JSONField(default=None, null=True)

    class Meta:
        verbose_name = "Оценка"
        verbose_name_plural = "Оценки"
        constraints = [
            constraints.UniqueConstraint(
                "member_nomination", "event_staff", name="unique_lower_name_category"
            )
        ]

    def __str__(self) -> str:
        return f"{self.score} --- {self.event_staff}"


@receiver(post_save, sender=MemberNomination)
def save_url(sender, instance, **kwargs):
    if instance.url_video and not instance.url_message_video:
        integration = TelegramIntegration()
        integration.send_video_to_telegram_channel(instance)
