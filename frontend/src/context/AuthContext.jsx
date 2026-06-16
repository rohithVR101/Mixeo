import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // true until initial session check

  // On mount: check if there's an existing session
  useEffect(() => {
    api.getMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))     // not logged in — that's fine
      .finally(() => setLoading(false));
  }, []);

  const loginFn = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    return data;
  };

  const signupFn = async (email, displayName, password) => {
    const data = await api.signup(email, displayName, password);
    setUser(data.user);
    return data;
  };

  const logoutFn = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login: loginFn,
      signup: signupFn,
      logout: logoutFn,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
