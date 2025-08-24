'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Admin {
  id: string;
  name: string;
  login: string;
  active: boolean;
}

interface AdminAuthContextType {
  user: Admin | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Checking user...');
        const response = await fetch('/api/admin/me');
        if (response.ok) {
          console.log('User is authenticated');
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to check user', error);
        setUser(null);
      } finally {
        console.log('User check complete');
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setUser(null);
      router.push('/admin/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated: !!user, loading, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
