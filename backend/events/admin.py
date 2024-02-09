from django.contrib import admin
from django_json_widget.widgets import JSONEditorWidget

from users.models import User

from .models import *


@admin.register(
    Category,
    NominationAttribute,
    Event,
    EventCategory,
)
class DefaultEventAdmin(admin.ModelAdmin):
    pass


class NominationAttributeInline(admin.TabularInline):
    model = NominationAttribute


@admin.register(Nomination)
class NominationAdmin(admin.ModelAdmin):
    formfield_overrides = {models.JSONField: {"widget": JSONEditorWidget}}
    inlines = [NominationAttributeInline]


class MemberNominationInline(admin.TabularInline):
    model = MemberNomination


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    inlines = [MemberNominationInline]

    def get_form(self, request, obj=None, **kwargs):
        form = super(MemberAdmin, self).get_form(request, obj, **kwargs)
        form.base_fields["user"].queryset = User.objects.filter(is_staff=False)
        return form


@admin.register(CategoryNomination)
class CategoryNominationAdmin(admin.ModelAdmin):
    filter_horizontal = ("event_staff",)
    list_display = ("event_category", "nomination")
    list_display_links = ("event_category", "nomination")
    ordering = ["event_category", "nomination"]


@admin.register(MemberNomination)
class MemberNominationAdmin(admin.ModelAdmin):
    list_display = ("id", "member", "category_nomination")
    list_display_links = ("id", "member", "category_nomination")
    ordering = ["id"]


@admin.register(MemberNominationPhoto)
class MemberNominationPhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "member_nomination", "photo")
    list_display_links = ("id", "member_nomination", "photo")
    ordering = ["member_nomination"]


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ("id", "event_staff", "score", "member_nomination")
    list_display_links = ("id", "event_staff", "score", "member_nomination")
    ordering = ["event_staff"]


admin.site.site_title = "Админ-панель BeautyRank"
admin.site.site_header = "Админ-панель BeautyRank"
