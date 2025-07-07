import { jwtDecode } from "jwt-decode";
import { APP_TOKEN_KEY } from "../constants";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Account } from "../types";

export interface User {
  userId: string;
  email: string;
  username: string;
  accounts: Account[];
}

interface AuthContextProps {
  isLoggedIn: boolean;
  storeTokenInLS: (serverToken: string) => void;
  logoutUser: () => void;
  user: User | null;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>(
    localStorage.getItem(APP_TOKEN_KEY) || ""
  );
  const [user, setUser] = useState<User | null>(
    token ? jwtDecode<User>(token) : null
  );

  useEffect(() => {
    if (token) {
      setUser(jwtDecode<User>(token));
    }
  }, [token]);

  const storeTokenInLS = (serverToken: string) => {
    setToken(serverToken);
    localStorage.setItem(APP_TOKEN_KEY, serverToken);
  };

  const isLoggedIn = !!token;

  const logoutUser = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(APP_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        logoutUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return authContextValue;
};
