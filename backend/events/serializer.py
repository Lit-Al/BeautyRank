from .models import *
from rest_framework import serializers


class MemberNominationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberNomination
        fields = "__all__"
        read_only_fields = ["id"]


class MemberNominationForMasterSerializer(serializers.ModelSerializer):
    category_nomination = serializers.CharField(
        source="category_nomination.nomination.name", read_only=True
    )
    category = serializers.CharField(
        source="category_nomination.event_category.category.name", read_only=True
    )
    member = serializers.CharField(source="member.user", read_only=True)
    result_sum = serializers.IntegerField(source="result_all", read_only=True)

    class Meta:
        model = MemberNomination
        fields = "__all__"


class MemberNominationForRefereeSerializer(serializers.ModelSerializer):
    category_nomination = serializers.CharField(
        source="category_nomination.nomination.name", read_only=True
    )
    category = serializers.CharField(
        source="category_nomination.event_category.category.name", read_only=True
    )
    member = serializers.CharField(source="member.user", read_only=True)
    result_sum = serializers.IntegerField(source="result_for_staff", read_only=True)

    class Meta:
        model = MemberNomination
        fields = "__all__"
