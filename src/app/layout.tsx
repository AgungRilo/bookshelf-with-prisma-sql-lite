'use client';

import 'antd/dist/reset.css'; // Import Antd CSS
import './globals.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';
import ProtectedRoute from './components/protectedRoute';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isPublicRoute, setIsPublicRoute] = useState(true);
  useEffect(() => {
    const publicRoutes = ['/', '/register'];
    const currentPath = window.location.pathname; // Safe access to window
    setIsPublicRoute(publicRoutes.includes(currentPath));
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-100">
        <Provider store={store}>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            {isPublicRoute ? (
              children
            ) : (
              <ProtectedRoute>
                  {children}
              </ProtectedRoute>
            )}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
