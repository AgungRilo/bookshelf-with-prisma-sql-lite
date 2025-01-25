'use client';

import React, { useState } from 'react';
import { Layout, Space, Button, Switch, message, Modal } from 'antd';
import { BulbOutlined, BulbFilled, LogoutOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';

const { Header: AntdHeader } = Layout;

const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const data = useAppSelector((state) => state.auth.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // message.info(darkMode ? 'Light Mode Enabled' : 'Dark Mode Enabled');
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false); 
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <AntdHeader className="bg-white px-4 flex justify-between items-center">
      <div>
        <strong>Welcome, {data?.username}!</strong>
      </div>
      <Modal
        title="Confirm Logout"
        open={isModalVisible}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        closable={false}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
      <Space>
        <Switch
          checkedChildren={<BulbFilled />}
          unCheckedChildren={<BulbOutlined />}
          onChange={toggleDarkMode}
        />
        <Button icon={<LogoutOutlined />} danger onClick={showModal}>
          Logout
        </Button>
      </Space>
    </AntdHeader>
  );
};

export default Header;
