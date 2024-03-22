import { atomWithStorage } from 'jotai/utils';
import { IUser } from 'common/shared/types';
import { IChamp } from 'common/entities/champ';
import { atom } from 'jotai';

let initialUser: IUser | null = null;
let initialChamp: IChamp | null = null;
let initialAccess: string | null = null;
let initialRefresh: string | null = null;

if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  const storedChamp = localStorage.getItem('champ');
  const storedAccess = localStorage.getItem('accessToken');
  const storedRefresh = localStorage.getItem('refreshToken');
  initialUser = storedUser ? JSON.parse(storedUser) : null;
  initialChamp = storedChamp ? JSON.parse(storedChamp) : null;
  initialAccess = storedAccess ? storedAccess : null;
  initialRefresh = storedRefresh ? storedRefresh : null;
}

export const accessTokenAtom = atomWithStorage<string | null>(
  'accessToken',
  initialAccess
);

export const refreshTokenAtom = atomWithStorage<string | null>(
  'refreshToken',
  initialRefresh
);

export const userAtom = atomWithStorage<IUser | null>('user', initialUser);

export const avatarAtom = atom<any>(null);

export const champAtom = atomWithStorage<IChamp | null>('champ', initialChamp);
