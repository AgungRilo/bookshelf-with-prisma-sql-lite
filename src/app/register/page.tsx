'use client';

import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RegisterFormValues } from '../../interface/interface';
import { useAppSelector } from '@/redux/hooks';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/user/register', values);

      if (response.status === 200) {
        message.success('Registration successful!');
        router.push('/');
      }
    } catch (error: any) {
      if (error.response) {
        message.error(error.response.data.error || 'Registration failed');
      } else {
        message.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Register</h1>

        <Form<RegisterFormValues>
          name="register"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ username: '', email: '', password: '' }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: 'Username is required!' },
              { min: 3, message: 'Username must be at least 3 characters!' },
              { max: 20, message: 'Username cannot exceed 20 characters!' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores are allowed!' },
            ]}
          >
            <Input disabled={loading} placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input disabled={loading} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password is required!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
              { max: 50, message: 'Password cannot exceed 50 characters!' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
                message: 'Password must include uppercase, lowercase, number, and special character!' 
              },
            ]}
          >
            <Input.Password disabled={loading} placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={loading} loading={loading} block>
              Register
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <Button type="link" onClick={() => router.push('/')}>
              Login
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
