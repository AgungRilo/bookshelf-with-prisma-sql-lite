'use client';

import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, PlusOutlined, BulbOutlined, LogoutOutlined, BookOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: 'Dashboard',
    },
  ];
const Sidebar: React.FC = () => {
  return (
    <Sider
      collapsible
      breakpoint="md"
      collapsedWidth="80"
      className="h-full"
    >
      <div className="flex items-center justify-center  h-16 bg-blue-500">
        <BookOutlined className="text-white text-2xl text-center" />
        {/* Teks hanya tampil saat expanded */}
        {/* <span className="text-white text-lg font-bold ml-2 hidden md:inline">
          Bookshelf
        </span> */}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        className="mt-4"
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
