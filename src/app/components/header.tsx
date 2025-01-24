'use client';

import React, { useState } from 'react';
import { Layout, Space, Button, Switch, message } from 'antd';
import { BulbOutlined, BulbFilled, LogoutOutlined } from '@ant-design/icons';

const { Header: AntdHeader } = Layout;

const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // message.info(darkMode ? 'Light Mode Enabled' : 'Dark Mode Enabled');
  };

  const username = 'John Doe';

  return (
    <AntdHeader className="bg-white px-4 flex justify-between items-center">
      <div>
        <strong>Welcome, {username}!</strong>
      </div>
      <Space>
        <Switch
          checkedChildren={<BulbFilled />}
          unCheckedChildren={<BulbOutlined />}
          onChange={toggleDarkMode}
        />
        <Button icon={<LogoutOutlined />} danger onClick={() => message.success('Logged out')}>
          Logout
        </Button>
      </Space>
    </AntdHeader>
  );
};

export default Header;
