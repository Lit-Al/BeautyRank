export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  image: null | string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ISmsRequest {
  phone_number: string;
}

export interface ILoginResponse {
  access: string;
  refresh: string;
}

export interface IChamp {
  id: number;
  name: string;
  win_nominations: [
    {
      event_category: number;
      nomination: number;
      member_nomination: [
        {
          id: number;
          nomination: string;
          nomination_info: {
            additionalProp1: string;
            additionalProp2: string;
            additionalProp3: string;
          };
          category: string;
          member: string;
          result_sum: number;
          is_done: boolean;
        }
      ];
    }
  ];
  role: string;
}

export interface IModel {
  id: number;
  nomination: string;
  nomination_info: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
  category: string;
  member: string;
  result_sum: number;
  is_done: boolean;
}
