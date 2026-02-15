import { useCallback, useEffect, useState } from 'react';
import { UserRole } from './types';

const AUTH_KEY = 'selibre_auth';
const ROLE_KEY = 'selibre_role';
const USER_NAME_KEY = 'selibre_user_name';

interface SessionState {
  isAuthenticated: boolean;
  role: UserRole;
  userName: string;
}

export const useSession = () => {
  const [session, setSession] = useState<SessionState>({
    isAuthenticated: false,
    role: 'seller',
    userName: ''
  });

  useEffect(() => {
    const savedRole = localStorage.getItem(ROLE_KEY) as UserRole | null;
    const savedUserName = localStorage.getItem(USER_NAME_KEY);
    const savedAuth = localStorage.getItem(AUTH_KEY) === 'true';

    setSession((prev) => ({
      ...prev,
      role: savedRole || prev.role,
      userName: savedUserName || prev.userName,
      isAuthenticated: savedAuth
    }));
  }, []);

  const login = useCallback((role: UserRole, name: string) => {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(USER_NAME_KEY, name);

    setSession({
      isAuthenticated: true,
      role,
      userName: name
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_NAME_KEY);

    setSession((prev) => ({
      ...prev,
      isAuthenticated: false
    }));
  }, []);

  return {
    ...session,
    login,
    logout
  };
};
