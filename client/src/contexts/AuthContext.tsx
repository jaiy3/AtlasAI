import { createContext } from "react";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,

  setUser: () => {},
  setToken: () => {},

  logout: () => {},
});