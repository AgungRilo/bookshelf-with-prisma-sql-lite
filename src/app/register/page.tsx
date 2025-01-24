'use client';

import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { RegisterFormValues } from '../../interface/interface';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Registration successful!');
        router.push('/'); // Redirect to login page
      } else {
        message.error(data.error || 'Registration failed');
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
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
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
