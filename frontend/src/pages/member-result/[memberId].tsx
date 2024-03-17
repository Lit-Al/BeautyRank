import { Layout } from 'common/shared/ui/layout';
import { GoBackButton } from 'common/shared/ui/go-back-btn';
import { ResultList } from 'common/widgets/result-list';
import { useEffect } from 'react';

const MemberEvaluationPage = () => {
  useEffect(() => {
    document.body.classList.add('member-result-page');
    return () => {
      document.body.classList.remove('member-result-page');
    };
  }, []);
  return (
    <Layout pageTitle="Результат">
      <GoBackButton />
      <ResultList />
    </Layout>
  );
};

export default MemberEvaluationPage;
