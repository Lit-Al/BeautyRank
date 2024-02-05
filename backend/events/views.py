from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.mixins import (CreateModelMixin, ListModelMixin,
                                   RetrieveModelMixin)
from rest_framework.response import Response

from .permissions import IsMemberOrReadOnly, IsStaffOrReadOnly
from .serializer import *
from .winners import *


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
        event_id = kwargs["pk"]
        win_nominations = []
        nominations = CategoryNomination.objects.all()
        member_nominations_all = (
            MemberNomination.objects.all()
            .filter(category_nomination__event_category__event=event_id)
            .annotate(result_all=Sum("results__score"))
            .order_by("-result_all")
        )
        for nomination in nominations:
            member_nominations = member_nominations_all.filter(
                category_nomination=nomination
            )

            if member_nominations.exists():
                top_three = member_nominations[:3]
                win_nominations.append(
                    {"nomination_or_category": str(nomination), "members": top_three}
                )
        print(win_nominations)
        serializer = WinnersSerializer(win_nominations, many=True)
        return Response({"winners_nominations": serializer.data})

    @action(
        detail=True, methods=["get"]
    )  # TODO: Переделать сериализатор, либо разделить это на два action'a. ПОТЕСТИТЬ!
    def winner_with_3_and_2_nom_WANT_REMAKE(self, request, *args, **kwargs):
        event_id = kwargs["pk"]
        winner_two_nominations = get_sorted_members(get_members(event_id)).first()
        winner_id_for_three = get_sorted_members_for_top3(get_members_gte_3(event_id))[
            0
        ]
        winner_for_three = Member.objects.get(id=winner_id_for_three)
        print("WIN TWO:", winner_two_nominations)
        print("WIN THREE", winner_for_three)
        serializer = WinnersSerializer(winner_for_three, many=True)

        return Response({"winners_top3": serializer.data})

    @action(detail=True, methods=["get"])
    def winners_categories(self, request, *args, **kwargs):
        win_categories = []
        event_id = kwargs["pk"]
        categories = Category.objects.filter(
            categories_in_EventCategoryModel__event=event_id
        )
        print(categories)
        for category in categories:
            member_nominations = MemberNomination.objects.filter(
                category_nomination__event_category__category=category
            )
            members = set(member_nominations.values_list("member", flat=True))
            top_three = []
            members_in_current_event = Member.objects.filter(event=event_id)
            for member in members:
                result_all = sum(
                    Result.objects.filter(
                        member_nomination__member=member,
                        member_nomination__category_nomination__event_category__category=category,
                    ).values_list("score", flat=True)
                )
                top_three.append(
                    {
                        "member": members_in_current_event.get(pk=member),
                        "result_all": result_all,
                    }
                )
            top_three = sorted(top_three, reverse=True, key=lambda x: x["result_all"])[
                :3
            ]
            win_categories.append(
                {"nomination_or_category": str(category), "members": top_three}
            )
        print(win_categories)

        serializer = WinnersSerializer(win_categories, many=True)

        return Response({"winners_categories": serializer.data})

    #         # ВЫИГРАННЫЕ КАТЕГОРИИ (ГРАН-ПРИ)
    #         win_categories = {}
    #         categories = Category.objects.all()
    #
    #         for category in categories:
    #             member_nominations = MemberNomination.objects.filter(
    #                 category_nomination__event_category__category=category)
    #             members = set(member_nominations.values_list('member', flat=True))
    #             top_three = []
    #             members_all = Member.objects.all()
    #             for member in members:
    #                 total = sum(Result.objects.filter(
    #                     membernomination__member=member,
    #                     membernomination__category_nomination__event_category__category=category,
    #                 ).values_list('score', flat=True))
    #                 top_three.append({'member': members_all.get(pk=member), 'total': total})
    #             top_three = sorted(top_three, reverse=True, key=lambda x: x['total'])[:3]
    #             win_categories[category] = top_three
    #
    #         data['win_categories'] = win_categories
    #
    #         return data
