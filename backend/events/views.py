from django.db.models import Q, Case, When, F, BooleanField
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin
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
        queryset = (
            super()
            .get_queryset()
            .annotate(
                count_results=Count("results"),
                count_staffs=Count("category_nomination__event_staff"),
            )
            .annotate(
                is_done=Case(
                    When(count_results=F("count_staffs"), then=True),
                    default=False,
                    output_field=BooleanField(),
                )
            )
            .filter(
                Q(member__user=self.request.user)
                | Q(category_nomination__event_staff=self.request.user)
                | Q(
                    category_nomination__event_category__event__owners=self.request.user
                )
                | Q(
                    category_nomination__event_category__event__members__user=self.request.user,
                    is_done=True,
                )
            )
        )  # TODO: сделать такое же для другие эндрпоинтов
        return queryset


class MemberNominationPhotoViewSet(
    ListModelMixin, CreateModelMixin, viewsets.GenericViewSet
):
    queryset = MemberNominationPhoto.objects.all()
    serializer_class = MemberNominationPhotoSerializer
    filterset_fields = ["member_nomination"]
    ordering_fields = ["before_after"]
    permission_classes = [IsMemberOrReadOnly]

    def get_queryset(self):  # TODO: доделать аналогию как с эндпоинтом выше
        queryset = (
            super()
            .get_queryset()
            .filter(
                Q(member_nomination__member__user=self.request.user)
                | Q(
                    member_nomination__category_nomination__event_staff=self.request.user
                )
                | Q(
                    member_nomination__category_nomination__event_category__event__owners=self.request.user
                )
            )
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
