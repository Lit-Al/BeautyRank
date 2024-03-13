import { FC } from 'react';
import { IEvaluationCriteriaFormProps } from '../../lib';
import styles from './EvaluationCriteriaForm.module.scss';

export const EvaluationCriteriaForm: FC<IEvaluationCriteriaFormProps> = ({
  attributes,
  handleChange,
  totalScore,
}) => {
  return (
    <>
      <form className={styles.evaluation__criteria_form}>
        {attributes.map((attribute) => (
          <div key={attribute.name} className={styles.evaluation__criteria_box}>
            <h3 className={styles.evaluation__criteria_name}>
              {attribute.name}
            </h3>
            <ul className={styles.evaluation__criteria_list}>
              {Array.from({ length: attribute.max_score }, (_, i) => i + 1).map(
                (score) => (
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
                )
              )}
            </ul>
          </div>
        ))}
      </form>
      <p className={styles.evaluation__total}>
        Сумма баллов: <span>{totalScore}</span>
      </p>
    </>
  );
};

export default EvaluationCriteriaForm;
