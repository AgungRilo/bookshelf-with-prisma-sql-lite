import 'antd/dist/reset.css'; // Import Antd CSS
import './globals.css';

export const metadata = {
  title: 'BookShelf Login',
  description: 'Login or Register to BookShelf',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-100">
        {children}
      </body>
    </html>
  );
}
