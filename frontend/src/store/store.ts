import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { IUser } from '../models/IUser';

// let initialUser: UserState | null = null;

// if (typeof window !== 'undefined') {
//   const storedUser = localStorage.getItem('user');
//   initialUser = storedUser ? JSON.parse(storedUser) : null;
// }

interface AuthState {
    accessToken: string | null
    isLoading: boolean
    error: string | null
}

export const authData = atom<AuthState | null>(null)

export const userAtom = atomWithStorage<IUser | null>('user', null);

export const avatarAtom = atom(null);

export const avatarExistAtom = atom(false);

