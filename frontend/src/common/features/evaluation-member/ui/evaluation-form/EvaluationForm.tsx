import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from './EvaluationForm.module.scss';
import { getMember, getMemberPhotos } from 'common/shared/api/members';
import { useMutation } from 'react-query';
import { IMember } from 'common/entities/member';
import Image from 'next/image';
import { IPhoto } from 'common/features/upload-member-photo/lib';
import { getMemberAssessmentsAttributes } from 'common/shared/api/assessments';
import { Button } from 'common/shared/ui/button';
import { Loader } from 'common/shared/ui/loader';
import EvaluationModal from '../evaluation-modal/EvaluationModal';
import { IEvaluationFormProps, IMemberAssessmentsAttributes } from '../../lib';

const EvaluationForm = ({ memberId }: IEvaluationFormProps) => {
  const [member, setMember] = useState<IMember>();
  const [memberPhotos, setMemberPhotos] = useState<IPhoto[]>();
  const [isModalOpen, setModalOpen] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [memberAttributes, setMemberAttributes] = useState<
    IMemberAssessmentsAttributes[]
  >([]);

  const isAllAttributesFilled = memberAttributes.every(
    (attribute) => attribute.score !== undefined
  );

  const getMemberItem = useMutation(async () => {
    try {
      if (memberId) {
        const { data } = await getMemberPhotos(memberId);
        const { data: memberData } = await getMember(memberId);
        const { data: memberAssessmentsAttributes } =
          await getMemberAssessmentsAttributes(memberId);

        setMemberAttributes(memberAssessmentsAttributes);
        setMember(memberData);
        setMemberPhotos(data);
      }
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    getMemberItem.mutateAsync();
  }, [memberId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    attribute: IMemberAssessmentsAttributes
  ) => {
    const newScore = Number(e.target.value);
    const oldScore = attribute.score || 0;
    setTotalScore(totalScore + newScore - oldScore);
    setMemberAttributes((prevMemberAttributes) =>
      prevMemberAttributes.map((attr) =>
        attr.name === attribute.name ? { ...attr, score: newScore } : attr
      )
    );
  };
  return (
    <>
      {member ? (
        <>
          <h1 className={styles.evaluation__title}>Оцените Участника</h1>
          <div className={styles.evaluation__box}>
            <div>
              <p className={styles.evaluation__separation}>ДО</p>
              <ul className={styles.evaluation__list}>
                {memberPhotos?.map((memberData) => {
                  if (memberData.before_after === 'BE') {
                    return (
                      <li
                        key={memberData.id}
                        className={styles.evaluation__item}
                      >
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
            </div>
            <div>
              <p className={styles.evaluation__separation}>ПОСЛЕ</p>
              <ul className={styles.evaluation__list}>
                {memberPhotos?.map((memberData) => {
                  if (memberData.before_after === 'AF') {
                    return (
                      <li
                        key={memberData.id}
                        className={styles.evaluation__item}
                      >
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
            </div>
          </div>
          <h2 className={styles.evaluation__category}>
            {member?.nomination} {member?.category}
          </h2>
          <form className={styles.evaluation__criteria_form}>
            {memberAttributes.map((attribute) => (
              <div
                key={attribute.name}
                className={styles.evaluation__criteria_box}
              >
                <h3 className={styles.evaluation__criteria_name}>
                  {attribute.name}
                </h3>
                <ul className={styles.evaluation__criteria_list}>
                  {Array.from(
                    { length: attribute.max_score },
                    (_, i) => i + 1
                  ).map((score) => (
                    <li
                      key={attribute.name + score}
                      className={styles.evaluation__radio_group}
                    >
                      <label>
                        <input
                          className={styles.evaluation__radio}
                          type="radio"
                          name={attribute.name}
                          value={score}
                          onChange={(e) => handleChange(e, attribute)}
                        />
                        <span>{score}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </form>
          <p className={styles.evaluation__total}>
            Сумма баллов: <span>{totalScore}</span>
          </p>
          <Button
            disabled={!isAllAttributesFilled}
            className={styles.evaluation__modal_btn}
            onClick={() => setModalOpen(true)}
          >
            Подтвердить
          </Button>
        </>
      ) : (
        <Loader />
      )}
      <EvaluationModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        member={member!}
        memberPhotos={memberPhotos!}
        totalScore={totalScore}
        memberAttributes={memberAttributes}
        isAllAttributesFilled={isAllAttributesFilled}
      />
    </>
  );
};

export default EvaluationForm;
