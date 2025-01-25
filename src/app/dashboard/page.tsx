'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Menu, Button, Table, Tag, Input, Space, Switch, message } from 'antd';
import { PlusOutlined, LogoutOutlined, UserOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import LoadingScreen from '../components/loadingScreen';
import ProtectedRoute from '@/app/components/protectedRoute';
import axios from 'axios';

const { Content } = Layout;
const { Search } = Input;

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    reading: 0,
    completed: 0,
  });
  const username = 'John Doe';
  const data = [
    { key: '1', title: 'The Pragmatic Programmer', author: 'Dave Thomas', category: 'technology', status: 'completed' },
    { key: '2', title: 'Clean Code', author: 'Robert C. Martin', category: 'technology', status: 'reading' },
    { key: '3', title: 'Design Patterns', author: 'Erich Gamma', category: 'technology', status: 'unread' },
  ];

  const columns = [
    {
      title: 'Judul & Penulis',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div>
          <strong>{text}</strong>
          <br />
          <small>{record.author}</small>
        </div>
      ),
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        const color = text === 'completed' ? 'green' : text === 'reading' ? 'orange' : 'red';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Aksi',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" icon={<UserOutlined />} />
          <Button type="link" danger icon={<LogoutOutlined />} />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500);

    return () => clearTimeout(timer);
  }, [])

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ProtectedRoute>
      <Layout className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}>
        {/* Sidebar */}
        <Sidebar />
        {/* Main Layout */}
        <Layout>
          <Header />
          {/* Content */}
          <Content className="m-4">
            <div className="p-4 bg-white rounded-md shadow-sm">
              {/* Search & Add Button */}
              <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
                <Search placeholder="Cari judul atau penulis..." className="w-full sm:w-auto" enterButton />
                <Button type="primary" icon={<PlusOutlined />}>
                  Tambah Buku
                </Button>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500 text-white p-6 rounded shadow">
                  <h3 className="text-lg font-semibold">Total Buku</h3>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-yellow-500 text-white p-6 rounded shadow">
                  <h3 className="text-lg font-semibold">Sedang Dibaca</h3>
                  <p className="text-2xl font-bold">{stats.reading}</p>
                </div>
                <div className="bg-green-500 text-white p-6 rounded shadow">
                  <h3 className="text-lg font-semibold">Selesai Dibaca</h3>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={{ defaultPageSize: 3 }}
                  rowKey="key"
                  className="w-full"
                />
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </ProtectedRoute>
  );
}
