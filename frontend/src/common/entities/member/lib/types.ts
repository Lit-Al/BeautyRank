export interface IMember {
  id: number;
  nomination: string;
  nomination_info: {
    after: [
      {
        id: number;
        name: string;
        image: string;
      }
    ];
    before: [
      {
        id: number;
        name: string;
        image: string;
      }
    ];
  };
  category: string;
  member: string;
  result_sum: number;
  is_done: boolean;
  preview: string;
  url_message_video: string;
}

export interface MemberCardProps {
  member: IMember;
}
