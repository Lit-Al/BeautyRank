from .models import *
from rest_framework import serializers


class MemberNominationPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberNominationPhoto
        fields = ("id", "member_nomination", "photo", "before_after", "name")
        read_only_fields = ["id"]


class MemberNominationSerializer(serializers.ModelSerializer):
    nomination = serializers.CharField(
        source="category_nomination.nomination.name", read_only=True
    )
    nomination_info = serializers.JSONField(
        source="category_nomination.nomination.photos_conf"
    )
    category = serializers.CharField(
        source="category_nomination.event_category.category.name", read_only=True
    )
    member = serializers.CharField(source="member.user", read_only=True)
    result_sum = serializers.IntegerField(source="result_all", read_only=True)
    first_photo = serializers.SerializerMethodField()

    class Meta:
        model = MemberNomination
        fields = (
            "id",
            "nomination",
            "nomination_info",
            "category",
            "member",
            "result_sum",
            "first_photo",
        )
        read_only_fields = ["id"]

    def get_first_photo(self, obj):
        first_photo = obj.photos.first()
        if first_photo:
            return first_photo.photo.url
        else:
            return None
