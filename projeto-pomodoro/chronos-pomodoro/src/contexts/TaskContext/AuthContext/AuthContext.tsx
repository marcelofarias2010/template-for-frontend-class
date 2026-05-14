import { createContext } from "react";

export type AuthContextValue = {
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);