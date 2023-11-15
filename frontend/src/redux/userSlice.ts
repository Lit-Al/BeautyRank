import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    id: number,
    first_name: string,
    last_name: string,
    is_staff: boolean,
    image: null | string
}

const initialState: UserState = {
  id: 0,
  first_name: '',
  last_name: '',
  is_staff: false,
  image: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    setImage: (state, action: PayloadAction<string | null>) => {
      state.image = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export const { setImage } = userSlice.actions;
export default userSlice.reducer;