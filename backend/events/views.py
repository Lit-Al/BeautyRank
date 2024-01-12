from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q, Sum, Max, F
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, UpdateView
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.mixins import UpdateModelMixin, ListModelMixin, RetrieveModelMixin, CreateModelMixin
from rest_framework.response import Response

from .models import MemberNomination, Result, NominationAttribute, EventStaff, CategoryNomination, Category, \
    Member
from .serializer import MemberNominationForMasterSerializer, MemberNominationSerializer, \
    MemberNominationForRefereeSerializer


class MemberNominationViewSet(UpdateModelMixin, CreateModelMixin, viewsets.GenericViewSet):
    queryset = MemberNomination.objects.all()
    serializer_class = MemberNominationSerializer

    @action(detail=False, methods=['get'], serializer_class=MemberNominationForMasterSerializer)
    def master_page(self, request, *args, **kwargs):
        id = request.user
        data = {}
        data['my_jobs'] = MemberNominationForMasterSerializer(MemberNomination.objects.select_related('category_nomination__nomination',
                                                                       'category_nomination__event_category__category').filter(
            member__user=id
        ).annotate(result_all=Sum('results__score', default=0)).order_by('photo_1', 'result_all'), many=True,
                                                     context={'result_sum': True}).data

        data['other_jobs'] = MemberNominationForMasterSerializer(MemberNomination.objects.exclude(
            Q(photo_1=None) | Q(photo_1='') | Q(member__user=id)).select_related(
            'category_nomination__nomination',
            'category_nomination__event_category__category').annotate(
            result_all=Sum('results__score', default=0)).order_by('photo_1', 'result_all'), many=True,
                                                        context={'result_sum': True}).data

        print('data', data)
        return Response(data=data)

    @action(detail=False, methods=['get'], serializer_class=MemberNominationForRefereeSerializer)
    def referee_page(self, request, *args, **kwargs):
        id = request.user
        data = {}
        data['jobs'] = MemberNominationForRefereeSerializer(MemberNomination.objects.exclude(Q(photo_1=None) | Q(photo_1='')).select_related(
            'category_nomination__nomination',
            'category_nomination__event_category__category', ).filter(
            category_nomination__staffs__user=id,
        ).annotate(
            results_for_staff=Sum('results__score', filter=Q(results__eventstaff__user=id), default=0),
        ).order_by('results_for_staff'), many=True).data

        print('data', data)
        return Response(data=data)





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
