'use client';

import { Layout } from "antd";
import Sidebar from "./sidebar";
import Header from "./header";
import { useTheme } from "@/context/ThemeContext";

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    return <>
        <Layout
            className="min-h-screen dark bg-gray-900 text-white"
        >
            <Sidebar />
            <Layout className={`${isDarkMode && "bg-[#3A4750]"}`}>
                <Header />
                {children}
            </Layout>
        </Layout>
    </>;
};

export default Container;
