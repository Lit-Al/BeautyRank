from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q, Sum, Max, F
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.db.models import QuerySet
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.mixins import (
    UpdateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    CreateModelMixin,
)
from rest_framework.response import Response
from .models import (
    MemberNomination,
    Result,
    NominationAttribute,
    EventStaff,
    CategoryNomination,
    Category,
    Member,
)
from .serializer import *


class MemberNominationViewSet(
    ListModelMixin,
    RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = MemberNomination.objects.all().prefetch_related('photos').annotate(
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


class NominationMemberPhotoViewSet:
    pass

# class UploadPhotoView(UpdateView):
#     model = MemberNomination
#     template_name = 'events/upload_photo.html'
#     fields = ['photo_1', 'photo_2', 'photo_3', 'photo_4']
#
#     def get_context_data(self, **kwargs):
#         data = super().get_context_data(**kwargs)
#
#         data['job'] = MemberNomination.objects.exclude(photo_1=None).select_related('category_nomination__nomination',
#                                                                                     'category_nomination__event_category__category', ).filter(
#             id=self.kwargs['pk']
#         ).annotate(
#             results_for_staff=Sum('results__score', filter=Q(results__eventstaff__user=self.request.user), default=0),
#         ).order_by('results_for_staff').first()
#         return data
#
#     def get_object(self, queryset=None):
#         return MemberNomination.objects.filter(pk=self.kwargs['pk']).first()
#
#     def get_success_url(self):
#         return reverse_lazy('master_page')
#
#
# class RefereeAssessmentView(TemplateView):
#     template_name = 'events/referee_assessment.html'
#
#     def get_context_data(self, **kwargs):
#         data = super().get_context_data(**kwargs)
#         data['attributes'] = NominationAttribute.objects.select_related().filter(
#             nomination__nom__categ__id=self.kwargs['pk']
#         )
#
#         data['job'] = MemberNomination.objects.exclude(photo_1=None).select_related('category_nomination__nomination',
#                                                                                     'category_nomination__event_category__category', ).filter(
#             id=self.kwargs['pk']
#         ).annotate(
#             results_for_staff=Sum('results__score', filter=Q(results__eventstaff__user=self.request.user), default=0),
#         ).order_by('results_for_staff').first()
#         data['scores'] = Result.objects.filter(eventstaff__user=self.request.user,
#                                                membernomination=data['job']).first()
#         return data
#
#     def post(self, request, *args, **kwargs):
#         data = {**request.POST}
#         print(data.pop('csrfmiddlewaretoken'))
#         score = sum([int(x[0]) for x in data.values()])
#         Result.objects.create(score=score, eventstaff=request.user.eventstaff_set.first(),
#                               membernomination_id=self.kwargs['pk'], score_retail=data)
#         return redirect(reverse_lazy('referee_page'))
#
#
# class EvaluationsView(TemplateView):
#     template_name = 'events/evaluations.html'
#
#     def get_context_data(self, **kwargs):
#         job = MemberNomination.objects.get(pk=self.kwargs['pk'])
#         data = super().get_context_data(**kwargs)
#         data['staffs'] = [None,
#                           *EventStaff.objects.filter(category_nomination__categ__in=[job]).order_by('user__last_name')]
#         nomination = job.category_nomination.nomination
#         attributes = NominationAttribute.objects.filter(nomination=nomination).distinct()
#         results = job.results.all().order_by('eventstaff__user__last_name')
#         scores = []
#         for attribute in attributes:
#             score_row = []
#             for result in results:
#                 score_row.append(result.score_retail[attribute.name][0])
#             scores.append({'values': score_row, 'name': attribute.name})
#         data['scores'] = scores
#         data['job'] = job
#         data['user_request'] = self.request.user
#         return data
#
#
# class ResultOfAllEvents(TemplateView):
#     template_name = 'events/end_result.html'
#
#     def get_context_data(self, **kwargs):
#         data = super().get_context_data(**kwargs)
#
#         win_nominations = {}
#         nominations = CategoryNomination.objects.all()
#         member_nominations_all = MemberNomination.objects.all().annotate(total_score=Sum('results__score')).order_by(
#             '-total_score')
#         for nomination in nominations:
#             member_nominations = member_nominations_all.filter(category_nomination=nomination)
#
#             if member_nominations.exists():
#                 top_three = member_nominations[:3]
#                 win_nominations[nomination] = top_three
#
#         data['win_nominations'] = win_nominations
#
#         win_categories = {}
#         categories = Category.objects.all()
#
#         for category in categories:
#             member_nominations = MemberNomination.objects.filter(category_nomination__event_category__category=category)
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
