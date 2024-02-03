from events.models import Member
from django.db.models import Sum, Count


def get_members(event):
    return (
        Member.objects.filter(event=event)
        .annotate(count_nom=Count("membernom"))
        .filter(count_nom=2)
    )


def get_members_gte_3(event):
    return (
        Member.objects.filter(event=event)
        .annotate(count_nom=Count("membernom"))
        .filter(count_nom__gte=3)
    )


def get_sorted_members(members):
    return members.annotate(
        total_score=Sum("membernom__results__score")
    ).order_by("-total_score")


def get_sorted_members_for_top3(members):
    members = members.prefetch_related("membernom__category_nomination__nomination",
                                       "membernom__results")
    members_with_scores = {}

    for member in members:
        top_3_nominations = member.membernom.annotate(
            total_score=Sum("results__score")
        ).order_by("-total_score")[:3]
        total_score = sum(nomination.total_score for nomination in top_3_nominations)
        members_with_scores[member.id] = total_score

    sorted_members = sorted(
        members_with_scores.items(), key=lambda x: x[1], reverse=True
    )[:3]
    return [member_id for member_id, _ in sorted_members]
