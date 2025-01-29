'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Space, Button, Switch, message, Modal } from 'antd';
import { BulbOutlined, BulbFilled, LogoutOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useTheme } from "@/context/ThemeContext";
import ConfirmModal from './modalConfirmation';
const { Header: AntdHeader } = Layout;

const Header: React.FC = () => {
  const data = useAppSelector((state) => state.auth.user);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const dispatch = useAppDispatch();
  const router = useRouter();


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
    localStorage.removeItem("theme");
  };

  return (
    <AntdHeader className={`${isDarkMode ? "bg-black" : "bg-white"} px-4 py-3 flex flex-wrap justify-between items-center shadow-sm`}>
      <div className={`text-lg font-semibold ${isDarkMode ? "text-whit" : "text-gray-800"}`}>
        Welcome, <span className="text-blue-600">{data?.username}</span>!
      </div>
      <ConfirmModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmDanger={true} // Tombol merah seperti `danger: true`
        cancelText="Cancel"
        isDarkMode={isDarkMode}
        closable={false} // Tidak bisa ditutup tanpa tombol
      />
      <Space size="middle" className="flex items-center">
        <Switch
          checkedChildren={<BulbFilled />}
          unCheckedChildren={<BulbOutlined />}
          checked={isDarkMode}
          onChange={toggleTheme}
          className="border-gray-300"
        />
        <Button icon={<LogoutOutlined />} danger onClick={showModal} className="px-4">
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </Space>
    </AntdHeader>
  );
};

export default Header;
