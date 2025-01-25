'use client';

import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/features/authSlice';
import axios from 'axios';
import LoadingScreen from './components/loadingScreen';
export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);

  const dispatch = useAppDispatch();
  if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes('Warning: React hydration mismatch')) {
        return; // Ignore hydration mismatch warnings
      }
      originalConsoleError(...args);
    };
  }
   useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard'); 
    }
  }, [isAuthenticated, router]);
  useEffect(() => {
      const timer = setTimeout(() => {
        setLoadingScreen(false)
      }, 500);
  
      return () => clearTimeout(timer);
    }, [])
  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true); // Indikasi loading
    try {
      const response = await axios.post('/api/user/login', values); // Request dengan axios
  
      // Jika response sukses
      if (response.status === 200) {
        const data = response.data;
        dispatch(login(data?.user));
        router.push('/dashboard'); 
        message.success('Login successful');
      }
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.error || 'Login failed'); // Pesan error dari server
      } else {
        message.error('Something went wrong'); // Error selain dari server
      }
    } finally {
      setLoading(false); 
    }
  };

  if (loadingScreen) {
    return <LoadingScreen />;
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Login to BookShelf</h1>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ email: '', password: '' }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <Button type="link" onClick={() => router.push('/register')}>
              Register
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
