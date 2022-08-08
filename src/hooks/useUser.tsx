import { getAuth, onAuthStateChanged } from 'firebase/auth';
import * as React from 'react';
import {
  useEffect,
  useContext,
  createContext,
  useReducer,
  Reducer,
} from 'react';
import { User } from '../types/User';

export type UserState = { user?: User; loading: boolean };

const initialState: UserState = { user: undefined, loading: true };

export type UserAction =
  | {
      type: 'sign_in';
      user: User;
    }
  | { type: 'sign_out' }
  | { type: 'loading_complete' };

export const UserContext = createContext<
  { state: UserState; dispatch: UserDispatch } | undefined
>(undefined);

export type UserDispatch = (action: UserAction) => void;

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'sign_in':
      console.log('signing in...', state);
      return { ...state, user: action.user, loading: false };
    case 'sign_out':
      return { user: undefined, loading: false };
    case 'loading_complete':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const UserProvider = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [state, dispatch] = useReducer<Reducer<UserState, UserAction>>(
    userReducer,
    initialState
  );
  const auth = getAuth();
  useEffect(() => {
    const unsubsribe = onAuthStateChanged(auth, (user) => {
      console.log('onauthchange', user);
      if (user) {
        dispatch({ type: 'sign_in', user });
      } else {
        dispatch({ type: 'sign_out' });
      }
    });
    return () => {
      unsubsribe();
    };
  }, [auth]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserState => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be within UserProvider');
  }
  return context.state;
};
