"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";
import { api } from "@/services/api";
import { getToken, getUserRole, setToken, setUserRole, removeToken } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  userRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);

  useEffect(() => {
    // Check for existing token on mount
    const initAuth = async () => {
      const token = getToken();
      const storedRole = getUserRole();

      if (token) {
        setUserRoleState(storedRole as UserRole);
        try {
          const response = await api.getCurrentUser();
          setUser(response.data);
        } catch (error) {
          // Token invalid, clear storage
          removeToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    const { access_token, user } = response;

    setToken(access_token);
    setUserRole(user.role);
    setUserRoleState(user.role);
    setUser(user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setUserRoleState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
