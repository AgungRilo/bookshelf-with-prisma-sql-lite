'use client';

import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Login successful');
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        message.error(data.error || 'Login failed');
      }
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
