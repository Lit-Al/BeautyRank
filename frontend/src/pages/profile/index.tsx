import { useAtomValue } from 'jotai';
import { champAtom, userAtom } from 'store';
import Avatar from 'common/shared/ui/avatar/Avatar';
import { UserName } from 'common/shared/ui/user-name';
import { UserRole } from 'common/shared/ui/user-role';
import { UserAction } from 'common/shared/ui/user-action';
import { Layout } from 'common/shared/ui/layout';
import Link from 'next/link';
import { Loader } from 'common/shared/ui/loader';
import { useEffect, useState } from 'react';
import { MembersList } from 'common/widgets/members-list/';
import { useRouter } from 'next/router';
import { EvaluationModal } from 'common/features/evaluation-member/ui';
import { useMember } from 'common/features/evaluation-member/model';

function ProfilePage() {
  const champ = useAtomValue(champAtom);
  const user = useAtomValue(userAtom);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { query } = router;
  const { evaluation } = query;
  const { score } = query;

  useEffect(() => {
    setIsClient(true);

    document.body.classList.add('profile-page');

    return () => {
      document.body.classList.remove('profile-page');
    };
  }, []);

  const { member, memberPhotos, memberAttributes } = useMember(
    Number(evaluation!)
  );

  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);

  useEffect(() => {
    setEvaluationModalOpen(!!evaluation);
  }, [evaluation]);

  return (
    <Layout pageTitle="Профиль">
      {user && isClient ? (
        <>
          <Link href="/profile-edit">
            <Avatar edit />
          </Link>
          <UserName />
          <UserRole />
          <UserAction role={champ?.role!} />
          <MembersList />
          <EvaluationModal
            isModalOpen={evaluationModalOpen}
            setModalOpen={setEvaluationModalOpen}
            member={member!}
            memberPhotos={memberPhotos!}
            totalScore={Number(score)}
            memberAttributes={memberAttributes}
            nomination={`${member?.nomination} ${member?.category}`}
          />
        </>
      ) : (
        <Loader />
      )}
    </Layout>
  );
}

export default ProfilePage;
