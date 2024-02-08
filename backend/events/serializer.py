from rest_framework import serializers

from .models import *


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ("member_nomination", "score", "eventstaff", "score_retail")


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

    class Meta:
        model = MemberNomination
        fields = (
            "id",
            "nomination",
            "nomination_info",
            "category",
            "member",
            "result_sum",
        )
        read_only_fields = ["id"]

    # def get_first_photo(self, obj):
    #     first_photo = obj.photos.first()
    #     if first_photo:
    #         return first_photo.photo.url
    #     else:
    #         return None


class CategoryNominationSerializer(serializers.ModelSerializer):
    member_nomination = MemberNominationSerializer(many=True, read_only=True)

    class Meta:
        model = CategoryNomination
        fields = ("event_category", "nomination", "member_nomination")


class EventSerializer(serializers.ModelSerializer):
    win_nominations = CategoryNominationSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ("id", "name", "win_nominations")
        read_only_fields = ["id", "name", "win_nominations"]


class MemberNominationSerializerForWinners(serializers.ModelSerializer):
    member = serializers.CharField(source="member.user", read_only=True)
    result_sum = serializers.IntegerField(source="result_all", read_only=True)

    class Meta:
        model = MemberNomination
        fields = ("id", "member", "result_sum")
        read_only_fields = ["id"]


class WinnersSerializer(serializers.Serializer):
    name = serializers.CharField()
    members = MemberNominationSerializerForWinners(many=True)
