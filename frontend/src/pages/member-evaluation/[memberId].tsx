import React from 'react';
import { Layout } from 'common/shared/ui/layout';
import { GoBackButton } from 'common/shared/ui/go-back-btn';
import { useRouter } from 'next/router';
import { EvaluationForm } from 'common/features/evaluation-member/ui';

const MemberEvaluationPage = () => {
  const router = useRouter();
  const memberId = Number(router.query.memberId);

  return (
    <Layout pageTitle="Оцените Работу">
      <GoBackButton />
      <EvaluationForm memberId={memberId} />
    </Layout>
  );
};

export default MemberEvaluationPage;
