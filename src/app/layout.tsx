'use client';

import 'antd/dist/reset.css'; // Import Ant Design CSS
import './globals.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';
import ProtectedRoute from './components/protectedRoute';
import { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import LoadingScreen from './components/loadingScreen';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isPublicRoute, setIsPublicRoute] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const publicRoutes = ['/', '/register'];
      setIsPublicRoute(publicRoutes.includes(window.location.pathname));
    }
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Provider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <ThemeProvider>
              <ThemeConsumer>
                {isPublicRoute ? children : <ProtectedRoute>{children}</ProtectedRoute>}
              </ThemeConsumer>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}

// Komponen untuk membaca theme dari ThemeProvider dan menerapkannya di body
const ThemeConsumer = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {children}
    </div>
  );
};
