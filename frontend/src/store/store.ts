import { atomWithStorage } from 'jotai/utils';
import { IUser } from 'common/shared/types';

let initialUser: IUser | null = null;
let initialAccess: string | null = null;
let initialRefresh: string | null = null;

if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  const storedAccess = localStorage.getItem('accessToken');
  const storedRefresh = localStorage.getItem('refreshToken');
  initialUser = storedUser ? JSON.parse(storedUser) : null;
  initialAccess = storedAccess ? storedAccess : null;
  initialRefresh = storedRefresh ? storedRefresh : null;
}

export const accessTokenAtom = atomWithStorage<string | null>('accessToken', initialAccess)

export const refreshTokenAtom = atomWithStorage<string | null>('refreshToken', initialRefresh)

export const userAtom = atomWithStorage<IUser | null>('user', initialUser);
