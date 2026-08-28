import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { loginRequest, registerRequest, meRequest } from "../api/auth.api";

const AuthContext = createContext(null);
const TOKEN_KEY = "blanger_token";
const USER_KEY = "blanger_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    // Revalida a sessão no backend; se falhar (token expirado, API fora do ar etc.), mantém o que já está salvo localmente.
    meRequest()
      .then((freshUser) => {
        setUser(freshUser);
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = useCallback(async (credentials) => {
    const data = await loginRequest(credentials);
    persistSession(data);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerRequest(payload);
    persistSession(data);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return ctx;
}
