export interface IPhoto {
  member_nomination: number;
  photo: File | string;
  before_after: 'BE' | 'AF';
  name: string;
}
