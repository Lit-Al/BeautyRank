import { useMemo } from 'react';
import styles from './EvaluationForm.module.scss';
import { Button } from 'common/shared/ui/button';
import { Loader } from 'common/shared/ui/loader';
import { IEvaluationFormProps } from '../../lib';
import EvaluationCriteriaForm from '../evaluation-criteria-form/EvaluationCriteriaForm';
import { useMember, useSetMemberResult } from '../../model';
import { MemberPhotosList } from 'common/widgets/member-photos-list';
import { VideoLink } from 'common/shared/ui/video-link';

export const EvaluationForm = ({ memberId }: IEvaluationFormProps) => {
  const {
    member,
    memberPhotos,
    memberAttributes,
    totalScore,
    isLoading,
    handleChange,
  } = useMember(memberId);

  const isAllAttributesFilled = useMemo(() => {
    return memberAttributes.every((attribute) => attribute.score !== undefined);
  }, [memberAttributes]);

  const { mutateAsync: postResult, isLoading: isResultLoading } =
    useSetMemberResult({
      memberId: member?.id!,
      totalScore,
      memberAttributes,
    });

  if (isLoading) {
    return <Loader fullPage/>;
  }

  return (
    <>
      <h1 className={styles.evaluation__title}>Оцените Участника</h1>
      <MemberPhotosList memberPhotos={memberPhotos || []} />
      <VideoLink member={member!} />
      <h2 className={styles.evaluation__category}>
        {member?.nomination} {member?.category}
      </h2>

      <EvaluationCriteriaForm
        attributes={memberAttributes}
        totalScore={totalScore}
        handleChange={handleChange}
      />
      <Button
        disabled={!isAllAttributesFilled || isResultLoading}
        className={styles.evaluation__modal_btn}
        onClick={() => postResult()}
      >
        {isResultLoading ? 'Загрузка...' : 'Подтвердить'}
      </Button>
    </>
  );
};
