import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  role: string;
  company?: string;
  branch?: string;
  semester?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, role: string) => Promise<boolean>;
  register: (data: RegistrationData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, role: string): Promise<boolean> => {
    // Mock authentication - find user by email and role
    const user = mockUsers.find(u => u.email === email && u.role === role);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAuthenticated = !!currentUser;

  const register = async (data: RegistrationData): Promise<boolean> => {
    // Mock registration - create a new user
    const newUser: User = {
      id: mockUsers.length + 1,
      name: data.name,
      email: data.email,
      role: data.role as User['role'],
      ...(data.company && { company: data.company }),
      ...(data.branch && { branch: data.branch }),
      ...(data.semester && { semester: parseInt(data.semester) })
    };

    // In a real app, this would be an API call
    mockUsers.push(newUser);
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};