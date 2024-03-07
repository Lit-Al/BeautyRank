import React from 'react';
import styles from './EvaluationModal.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { IPhoto } from 'common/features/upload-member-photo/lib';
import { IMember } from 'common/entities/member';
import { Button } from 'common/shared/ui/button';
import { setMemberResults } from 'common/shared/api/assessments';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { useAtomValue } from 'jotai';
import { userAtom } from 'store';
import { IMemberAssessmentsAttributes } from '../../lib';

export interface IEvaluationModalProps {
  isModalOpen: boolean;
  memberPhotos: IPhoto[];
  setModalOpen: (isModalOpen: boolean) => void;
  member: IMember;
  totalScore: number;
  memberAttributes: IMemberAssessmentsAttributes[];
  isAllAttributesFilled: boolean;
}

export interface IResult {
  member_nomination: number;
  event_staff: number;
  score: number;
  score_retail?: {
    [key: string]: number | string;
  };
}

const EvaluationModal = ({
  isModalOpen,
  memberPhotos,
  setModalOpen,
  member,
  totalScore,
  memberAttributes,
  isAllAttributesFilled,
}: IEvaluationModalProps) => {
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const setMemberResult = useMutation(async () => {
    try {
      if (user && member.id) {
        const result: IResult = {
          member_nomination: member.id,
          event_staff: user.id!,
          score: totalScore,
          score_retail: {},
        };

        memberAttributes.forEach((attribute) => {
          if (attribute.score !== undefined) {
            result.score_retail![attribute.name] = attribute.score.toString();
          }
        });

        setMemberResults(result);
        router.push('/profile');
      }
    } catch (e) {
      console.log(e);
    }
  });

  const postResult = () => {
    setMemberResult.mutateAsync();
  };

  return (
    <div>
      <div
        className={` ${styles.evaluation__modal_box} ${
          isModalOpen ? '' : styles.evaluation__modal_box_close
        }`}
      >
        <div onClick={() => setModalOpen(false)} className={styles.blur}></div>
        <div className={styles.evaluation__modal}>
          <button
            className={styles.evaluation__close}
            onClick={() => setModalOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
            >
              <path
                d="M1.35492 14.438L14.938 0.85491M1.35352 0.646484L14.9366 14.2296"
                stroke="black"
                stroke-linecap="round"
              ></path>
            </svg>
          </button>
          <p className={styles.evaluation__modal_separation}>ПОСЛЕ</p>
          <ul className={styles.evaluation__list}>
            {memberPhotos?.map((memberData) => {
              if (memberData.before_after === 'AF') {
                return (
                  <li key={memberData.id} className={styles.evaluation__item}>
                    <Image
                      className={styles.evaluation__img}
                      src={memberData.photo as string}
                      width={75}
                      height={75}
                      alt={memberData.name}
                    />
                    <span className={styles.evaluation__name}>
                      {memberData.name}
                    </span>
                  </li>
                );
              }
              return null;
            })}
          </ul>
          <h3>
            {member?.nomination} {member?.category}
          </h3>
          <p className={styles.evaluation__total}>
            Сумма баллов: <span>{totalScore}</span>
          </p>
          <p className={styles.evaluation__comment}>
            Дать комментарий <Link href="#" />
          </p>
          <Button
            disabled={!isAllAttributesFilled}
            className={styles.evaluation__modal_btn}
            onClick={postResult}
          >
            Подтвердить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
