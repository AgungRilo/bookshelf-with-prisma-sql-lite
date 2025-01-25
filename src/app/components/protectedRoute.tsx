'use client';

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/'); // Redirect ke halaman login jika belum login
    }
  }, [isAuthenticated, router]);

  // Tampilkan konten jika user terautentikasi
  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
