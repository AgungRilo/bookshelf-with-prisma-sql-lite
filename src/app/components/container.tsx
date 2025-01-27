'use client';

import { Layout } from "antd";
import Sidebar from "./sidebar";
import Header from "./header";

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <><Layout 
    // className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}
    className="min-h-screen dark bg-gray-900 text-white"
    >
        <Sidebar />
        <Layout>
            <Header />
            {children}
        </Layout>
    </Layout>
    </>;
};

export default Container;
