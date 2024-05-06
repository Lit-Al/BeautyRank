import { Key } from 'react';

export interface IPhoto {
  id?: Key | null | undefined;
  member_nomination: number;
  photo: File | string;
  optimized_photo?: string | null;
  before_after: 'BE' | 'AF';
  name: string;
}
