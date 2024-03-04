from rest_framework import serializers

from .models import *


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ("member_nomination", "score", "event_staff", "score_retail")


class MemberNominationPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberNominationPhoto
        fields = ("id", "member_nomination", "photo", "before_after", "name")
        read_only_fields = ["id"]

    def validate(self, attrs):
        if self.context["request"].user != attrs["member_nomination"].member.user:
            raise serializers.ValidationError("Запрещено загружать фото в чужую работу")
        return super().validate(attrs)


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
    preview = serializers.SerializerMethodField()
    is_done = serializers.BooleanField(read_only=True)

    class Meta:
        model = MemberNomination
        fields = (
            "id",
            "nomination",
            "nomination_info",
            "category",
            "member",
            "result_sum",
            "is_done",
            "preview",
            "url_video",
            "url_message_video",
        )
        read_only_fields = ["id"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        unique_results = instance.results.order_by(
            'event_staff'
        ).distinct('event_staff')

        representation['result_sum'] = sum(result.score for result in unique_results)

        return representation

    def get_preview(self, obj) -> str:
        preview = obj.photos.first()
        if preview:
            return preview.photo.url
        else:
            return None


class CategoryNominationSerializer(serializers.ModelSerializer):
    member_nomination = MemberNominationSerializer(many=True, read_only=True)

    class Meta:
        model = CategoryNomination
        fields = ("event_category", "nomination", "member_nomination")


class EventSerializer(serializers.ModelSerializer):
    win_nominations = CategoryNominationSerializer(many=True, read_only=True)
    role = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ("id", "name", "win_nominations", "role")
        read_only_fields = ["id", "name", "win_nominations", "role"]

    def get_role(self, obj) -> str:
        user = self.context.get("request").user
        event = obj
        if CategoryNomination.objects.filter(event_staff=user).exists():
            return "Судья"

        if Member.objects.filter(user=user).exists():
            return "Мастер"

        if Event.objects.filter(pk=event.pk, owners=user).exists():
            return "Организатор"

        return "Unknown role"


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


class NominationAttributesSerializer(serializers.ModelSerializer):
    class Meta:
        model = NominationAttribute
        fields = ("name", "max_score")
        read_only_fields = ["id", "name", "max_score"]
