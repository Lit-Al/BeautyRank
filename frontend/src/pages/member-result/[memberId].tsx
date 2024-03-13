import styles from './member-result.module.scss';
import { Layout } from 'common/shared/ui/layout';
import { GoBackButton } from 'common/shared/ui/go-back-btn';
import { ResultList } from 'common/widgets/result-list';

const MemberEvaluationPage = () => {
  return (
    <div className={styles.UserBack}>
      <Layout pageTitle="Результат">
        <GoBackButton />
        <ResultList />
      </Layout>
    </div>
  );
};

export default MemberEvaluationPage;
