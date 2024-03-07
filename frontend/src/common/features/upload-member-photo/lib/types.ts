import { Key } from 'react';

export interface IPhoto {
  id?: Key | null | undefined;
  member_nomination: number;
  photo: File | string;
  before_after: 'BE' | 'AF';
  name: string;
}
