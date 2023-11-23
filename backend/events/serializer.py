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

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Add custom representation logic here if needed
        return representation

class ResponseSerializer(serializers.Serializer):
    my_jobs = MemberNominationSerializer(many=True)
    other_jobs = MemberNominationSerializer(many=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['my_jobs'] = MemberNominationSerializer(instance['my_jobs'], many=True).data
        data['other_jobs'] = MemberNominationSerializer(instance['other_jobs'], many=True).data
        return data
