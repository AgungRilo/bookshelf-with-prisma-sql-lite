'use client';

import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
    {
      key: '1',
      icon: <BookOutlined />,
      label: 'Dashboard',
    },
  ];
const Sidebar: React.FC = () => {
  return (
    <Sider
      collapsible={false}
      breakpoint="md"
      collapsedWidth="80"
      className="h-full"
    >
      <div className="flex items-center justify-center  h-16 bg-blue-500">
        <BookOutlined className="text-white text-2xl text-center" />
        <span className="ext-white ml-2 hidden sm:inline truncate">BookShelf</span>
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
