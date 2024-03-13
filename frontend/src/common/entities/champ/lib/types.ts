export interface IMemberNomination {
  id: number;
  nomination: string;
  nomination_info: any;
  category: string;
  member: string;
  result_sum: number;
  is_done: boolean;
}

export interface ICategoryNomination {
  event_category: number;
  nomination: number;
  member_nomination: IMemberNomination[];
}

export interface IChamp {
  id: number;
  name: string;
  win_nominations: ICategoryNomination[];
  role: string;
  image: string;
}

export interface ChampCardProps {
  champ: IChamp;
}
