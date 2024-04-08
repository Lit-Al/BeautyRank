from django.db.models import BooleanField, Case, F, Q, When, Count
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from events.permissions import (
    IsMemberOrReadOnly,
    IsStaffOrReadOnly,
    TelegramBotUpdate,
    IsOwnerOnly,
)
from events.serializer import *


class MemberNominationViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    Viewset для управления объектами MemberNomination.
    Предоставляет действия для получения списка, получения и обновления объектов.
    """

    queryset = MemberNomination.objects.all()
    serializer_class = MemberNominationSerializer
    filterset_fields = ["category_nomination__event_category__event", "is_done"]
    permission_classes = [TelegramBotUpdate]

    @method_decorator(cache_page(60 * 60 * 2))
    def list(self, request, *args, **kwargs):
        """
        Возвращает список всех объектов MemberNomination.
        """
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 60 * 2))
    def retrieve(self, request, *args, **kwargs):
        """
        Возвращает один объект MemberNomination по его ID.
        """
        return super().retrieve(request, *args, **kwargs)

    def get_queryset(self):
        """
        Возвращает queryset для объектов MemberNomination.
        Если запрос не от телеграмм-бота, то добавляет дополнительные поля и фильтры.
        """
        queryset = super().get_queryset()

        if not self.request.data.get("user", "client") == "telegram":
            queryset = (
                queryset.select_related(
                    "member",
                    "member__user",
                    "category_nomination",
                    "category_nomination__event_category",
                    "category_nomination__event_category__event",
                )
                .prefetch_related(
                    "results",
                    "category_nomination__event_staff",
                    "category_nomination__event_category__event__owners",
                    "category_nomination__event_category__event__members",
                    "category_nomination__event_category__event__members__user",
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
                .distinct()
            )

            return queryset
        return super().get_queryset()


class MemberNominationPhotoViewSet(
    ListModelMixin, CreateModelMixin, viewsets.GenericViewSet
):
    """
    Viewset для управления объектами MemberNominationPhoto.
    Предоставляет действия для получения списка и создания объектов.
    """

    queryset = MemberNominationPhoto.objects.all()
    serializer_class = MemberNominationPhotoSerializer
    filterset_fields = ["member_nomination"]
    ordering_fields = ["before_after"]
    permission_classes = [IsMemberOrReadOnly]

    @method_decorator(cache_page(60 * 60 * 2))
    def list(self, request, *args, **kwargs):
        """
        Возвращает список всех объектов MemberNominationPhoto.
        """
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        """
        Возвращает queryset для объектов MemberNominationPhoto.
        Добавляет дополнительные поля и фильтры.
        """
        queryset = (
            super()
            .get_queryset()
            .annotate(
                count_results=Count("member_nomination__results"),
                count_staffs=Count(
                    "member_nomination__category_nomination__event_staff"
                ),
            )
            .annotate(
                is_done=Case(
                    When(count_results=F("count_staffs"), then=True),
                    default=False,
                    output_field=BooleanField(),
                )
            )
            .filter(
                Q(member_nomination__member__user=self.request.user)
                | Q(
                    member_nomination__category_nomination__event_staff=self.request.user
                )
                | Q(
                    member_nomination__category_nomination__event_category__event__owners=self.request.user
                )
                | Q(
                    member_nomination__category_nomination__event_category__event__members__user=self.request.user,
                    is_done=True,
                )
            )
            .distinct()
        )
        return queryset


class ResultViewSet(ListModelMixin, CreateModelMixin, viewsets.GenericViewSet):
    """
    Viewset для управления объектами Result.
    Предоставляет действия для получения списка и создания объектов.
    """

    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    filterset_fields = ["member_nomination"]
    permission_classes = [IsStaffOrReadOnly]


class EventViewSet(
    UpdateModelMixin, ListModelMixin, RetrieveModelMixin, viewsets.GenericViewSet
):
    """
    Viewset для управления объектами Event.
    Предоставляет действия для получения списка; определенного объекта по его ID; а также обновление мероприятия.
    Показывает роль пользователя в этом мероприятии при запросе.
    """

    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_permissions(self):
        if self.action in [
            "partial_update",
            "update",
            "winners_nominations",
            "winners_of_categories",
        ]:
            permission_classes = [IsOwnerOnly]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=["get"], permission_classes=[IsOwnerOnly])
    def winners_nominations(self, request, *args, **kwargs):
        event = self.get_object()
        win_nominations = event.get_winners_nominations()
        serializer = WinnersSerializer(win_nominations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], permission_classes=[IsOwnerOnly])
    def winners_of_categories(self, request, *args, **kwargs):
        event = self.get_object()
        win_categories = event.get_winners_categories()
        serializer = WinnersSerializer(win_categories, many=True)
        return Response(serializer.data)


class NominationAttributeViewSet(ListModelMixin, viewsets.GenericViewSet):
    """
    Viewset для управления объектами NominationAttribute.
    Предоставляет действие для получения списка аттрибутов номинации и её максимальная оценка.
    """

    queryset = NominationAttribute.objects.all()
    serializer_class = NominationAttributesSerializer
    filterset_fields = ["nomination__nom__categ__id"]
