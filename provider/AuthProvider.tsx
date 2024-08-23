import React, { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  citizenIdentificationNumber: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticatedUser = await fakeAuthCheck();
      setUser(authenticatedUser);
      setIsLogin(true);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLogin, setIsLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

const fakeAuthCheck = (): Promise<User | null> =>
  new Promise((resolve) => setTimeout(() => resolve(null), 1000));
