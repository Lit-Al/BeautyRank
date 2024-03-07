import React from 'react';
import styles from './member-evaluation.module.scss';
import { Layout } from 'common/shared/ui/layout';
import { GoBackButton } from 'common/shared/ui/go-back-btn';
import { useRouter } from 'next/router';
import EvaluationForm from 'common/features/evaluation-member/ui/evaluation-form/EvaluationForm';

const MemberEvaluationPage = () => {
  const router = useRouter();
  const memberId = Number(router.query.memberId);

  return (
    <div className={styles.UserBack}>
      <Layout pageTitle="Оцените Работу">
        <GoBackButton />
        <EvaluationForm memberId={memberId} />
      </Layout>
    </div>
  );
};

export default MemberEvaluationPage;
