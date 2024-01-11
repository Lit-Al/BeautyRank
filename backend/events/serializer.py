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


class ResponseSerializer(serializers.Serializer):
    my_jobs = MemberNominationSerializer(many=True)
    other_jobs = MemberNominationSerializer(many=True)
