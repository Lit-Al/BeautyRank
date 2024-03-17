import { IMember } from 'common/entities/member';
import { IPhoto } from 'common/features/upload-member-photo/lib';
import { ChangeEvent } from 'react';

export interface IMemberAssessmentsAttributes {
  name: string;
  max_score: number;
  score?: number;
}

export interface IEvaluationFormProps {
  memberId: number;
}

export interface IMemberPhotoList {
  photos: IPhoto[];
  beforeAfter: string;
}

export interface IEvaluationCriteriaFormProps {
  attributes: IMemberAssessmentsAttributes[];
  handleChange: (
    e: ChangeEvent<HTMLInputElement>,
    attribute: IMemberAssessmentsAttributes
  ) => void;
  totalScore: number;
}

export interface IEvaluationModalProps {
  isModalOpen: boolean;
  memberPhotos: IPhoto[];
  setModalOpen: (isModalOpen: boolean) => void;
  member: IMember;
  totalScore: number;
  memberAttributes: IMemberAssessmentsAttributes[];
  isAllAttributesFilled: boolean;
  nomination: string;
}

export interface IResult {
  member_nomination: number;
  event_staff: number;
  event_staff_name?: string;
  score: number;
  score_retail?: {
    [key: string]: number | string;
  };
}

export interface SetMemberResultProps {
  memberId: number;
  totalScore: number;
  memberAttributes: IMemberAssessmentsAttributes[];
}
