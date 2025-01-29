"use client";

import { ConfigProvider , ThemeConfig} from "antd";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const isDarkMode = theme === "dark";
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const antdTheme: ThemeConfig = {
    components: {
      Input: {
        colorTextPlaceholder: isDarkMode ? "#888888" : "#bfbfbf",
        colorBgContainer: isDarkMode ? "#1f1f1f" : "#fff",
        colorText: isDarkMode ? "#fff" : "#000",
        colorBorder: isDarkMode ? "#434343" : "#d9d9d9",
      },
      Switch: {
        colorPrimary: isDarkMode ? "#40a9ff" : "#1890ff",
        colorBgContainer: isDarkMode ? "#1f1f1f" : "#ffffff",
        controlOutline: isDarkMode ? "#434343" : "#d9d9d9",
      },
    },
    token: {
      colorText: isDarkMode ? "#ffffff" : "#000000",
      colorPrimary: "#1890ff",
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ConfigProvider theme={antdTheme}>
        <div className={`${theme} transition-colors duration-300`}>{children}</div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
