from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.mixins import (CreateModelMixin, ListModelMixin,
                                   RetrieveModelMixin)
from rest_framework.response import Response

from .permissions import IsMemberOrReadOnly, IsStaffOrReadOnly
from .serializer import *


class MemberNominationViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = MemberNomination.objects.all().annotate(
        result_all=Sum("results__score", default=0)
    )
    serializer_class = MemberNominationSerializer
    filterset_fields = ["category_nomination__event_category__event"]
    ordering_fields = ["result_all"]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            queryset = queryset.filter(
                category_nomination__staffs__user=self.request.user
            )
        else:
            queryset = queryset.filter(member__user=self.request.user)
        return queryset


class MemberNominationPhotoViewSet(
    ListModelMixin, CreateModelMixin, viewsets.GenericViewSet
):
    queryset = MemberNominationPhoto.objects.all()
    serializer_class = MemberNominationPhotoSerializer
    filterset_fields = ["member_nomination"]
    ordering_fields = ["before_after"]
    permission_classes = [IsMemberOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            queryset = queryset.filter(
                member_nomination__category_nomination__staffs__user=self.request.user
            )
        else:
            queryset = queryset.filter(
                member_nomination__member__user=self.request.user
            )
        return queryset


class ResultViewSet(RetrieveModelMixin, CreateModelMixin, viewsets.GenericViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    filterset_fields = ["member_nomination"]
    permission_classes = [IsStaffOrReadOnly]


class EventViewSet(ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @action(detail=True, methods=["get"])
    def winners_nominations(self, request, *args, **kwargs):
        event = self.get_object()
        win_nominations = event.get_winners_nominations()
        serializer = WinnersSerializer(win_nominations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def winners_of_categories(self, request, *args, **kwargs):
        event = self.get_object()
        win_categories = event.get_winners_categories()
        serializer = WinnersSerializer(win_categories, many=True)

        return Response(serializer.data)
