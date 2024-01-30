from .models import *
from rest_framework import serializers


class MemberNominationPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberNominationPhoto
        fields = ("id", "photo", "before_after")


class MemberNominationSerializer(serializers.ModelSerializer):
    category_nomination = serializers.CharField(
        source="category_nomination.nomination.name", read_only=True
    )
    category = serializers.CharField(
        source="category_nomination.event_category.category.name", read_only=True
    )
    member = serializers.CharField(source="member.user", read_only=True)
    result_sum = serializers.IntegerField(source="result_all", read_only=True)
    photos = MemberNominationPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = MemberNomination
        fields = ("id", "category_nomination", "category", "member", "result_sum", "photos")
        read_only_fields = ["id"]
