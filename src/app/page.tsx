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
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingScreen, setLoadingScreen] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard'); 
    }else{
      router.replace('/')
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 500); // Hilangkan loading screen setelah 500ms

    return () => clearTimeout(timer);
  }, []);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true); 
    try {
      const response = await axios.post('/api/user/login', values);

      if (response.status === 200) {
        const data = response.data;
        dispatch(login(data?.user)); // Simpan user ke Redux state
        router.replace('/dashboard');
        message.success('Login successful');
      }
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.error || 'Login failed');
      } else {
        message.error('Something went wrong');
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
            rules={[{ required: true, message: 'Please input your email!' },  { type: 'email', message: 'Please enter a valid email!' },]}
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
