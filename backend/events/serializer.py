from .models import *
from rest_framework import serializers


# class ResultSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Result
#         fields = '__all__'


# class CategoryNominationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CategoryNomination
#         fields = ('event_category', 'nomination')


# Скорее всего отправляются сырые данные в виде айдишников (например категори номинатион) - нужно
# создать еще сериализаторы, которые будут передавать именно названия. А возможно в аннотации во вью все работает нормально!

class MemberNominationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberNomination
        fields = '__all__'
        read_only_fields = ["id"]


class MemberNominationForMasterSerializer(serializers.ModelSerializer):
    category_nomination = serializers.CharField(source='category_nomination.nomination.name', read_only=True)
    member = serializers.CharField(source='member.user', read_only=True)
    result_sum = serializers.IntegerField(source='result_all', read_only=True)

    class Meta:
        model = MemberNomination
        fields = '__all__'


class MemberNominationForRefereeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MemberNomination
        fields = '__all__'

