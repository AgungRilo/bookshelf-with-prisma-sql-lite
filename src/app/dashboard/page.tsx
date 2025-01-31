'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Button, Table, Tag, Input, Space, Pagination, message, Modal, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Container from '../components/container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faBook, faBookOpen, faCheckCircle, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BooksFormValues } from '@/interface/interface';
import { useAppSelector } from '@/redux/hooks';
import { SearchOutlined } from '@ant-design/icons';
import TableSkeleton from '../components/skeletonTable';
import { BOOK_CATEGORIES, READ_STATUS } from '../constant/constant';
import LoadingScreen from '../components/loadingScreen';
import { useTheme } from "@/context/ThemeContext";
import ConfirmModal from '../components/modalConfirmation';
export default function DashboardPage() {
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [loadingScreen, setLoadingScreen] = useState<boolean>(true);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [books, setBooks] = useState<BooksFormValues[]>([]);
  const [search, setSearch] = useState<string>(''); // Input langsung dari pengguna
  const [debouncedSearch, setDebouncedSearch] = useState<string>(''); // Nilai pencarian dengan debounce
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [bookToDelete, setBookToDelete] = useState<string>("");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  const [stats, setStats] = useState({
    total: 0,
    reading: 0,
    completed: 0,
  });
  const router = useRouter();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const { Option } = Select
  const { Content } = Layout;

  const fetchBooks = async (userId: string , page: number, limit: number, search: string, category?: string, status?: string) => {
    const controller = new AbortController();
    try {
      setLoadingTable(true);
      const response = await axios.get('/api/books/list', {
        params: {
          userId,
          page,
          limit,
          search,
          category: category || undefined, // Jangan kirim jika kosong
          status: status || undefined, // Jangan kirim jika kosong
        },
      });
      const { data, pagination } = response.data;
      setBooks(data);
      setPagination(pagination);
    } catch (error) {
      message.error('Failed to load books');
    } finally {
      setLoadingTable(false);
    }
    return () => controller.abort();
  };

  const fetchStats = async () => {
    const controller = new AbortController();
    if (!userId) return;

    try {
      const response = await axios.get('/api/user/stats', {
        params: { userId },
      });
      setStats(response.data);
    } catch (error) {
      message.error('Failed to get stats');
    }
    return () => controller.abort();
  };

  // Debounce untuk input pencarian
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  useEffect(() => {
    if (userId) {
      fetchBooks(userId, page, pageSize, debouncedSearch, category, status);
    }
  }, [userId, page, pageSize, debouncedSearch, category, status]); // Pastikan `category` & `status` dipantau

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 500); // Hilangkan loading screen setelah 500ms

    return () => clearTimeout(timer);
  }, []);

  const handleAdd = () => {
    router.push('/dashboard/add');
  };

  const handleEdit = (bookId: string) => {
    router.push(`/dashboard/edit/${bookId}`);
  };

  const handleDelete = async (bookId: string) => {
    setDeleteModalVisible(false);
    try {
      await axios.delete(`/api/books/delete?id=${bookId}`);
      message.success('Book deleted successfully');
      // fetchBooks(userId, page, pageSize, search);
      if (userId) {
        fetchBooks(userId, page, pageSize, debouncedSearch, category, status);
        fetchStats();
      }
    } catch (error) {
      message.error('Failed to delete book');
    }
  };

  const goToDetail = (id: string) => {
    router.push(`/dashboard/detail/${id}`);
  };

  const columns = [
    {
      title: 'Title & Author',
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
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => {
        const categoryLabel = BOOK_CATEGORIES.find((cat) => cat.value === text)?.label || "Unknown";
        return <Tag color="blue">{categoryLabel}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        const statusObj = READ_STATUS.find((status) => status.value === text);
        const label = statusObj ? statusObj.label : "Unknown";
        const color =
          text === "completed" ? "green" : text === "reading" ? "orange" : "red";

        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Space>
          <FontAwesomeIcon
            onClick={() => handleEdit(record.id)}
            icon={faPen}
            className="text-xl text-yellow-500 cursor-pointer"
          />
          <FontAwesomeIcon
            onClick={() => {
              setDeleteModalVisible(true);
              setBookToDelete(record.id);
            }}
            icon={faTrash}
            className="text-xl text-red-500 cursor-pointer"
          />
          <FontAwesomeIcon
            onClick={() => goToDetail(record.id)}
            icon={faArrowCircleRight}
            className="text-xl text-blue-500 cursor-pointer"
          />
        </Space>
      ),
    },
  ];

  if (loadingScreen) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <Content className="m-4">
        <div className={`p-4 ${theme === "dark" ? 'bg-black' : 'bg-white'} rounded-md shadow-sm`}>
          <h1 className="font-bold" style={{ fontSize: '24px' }}>
            Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search by Title or Author"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                className="w-full"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  placeholder="Filter by Category"
                  value={category}
                  onChange={(value) => setCategory(value)}
                  className={`w-full ${isDarkMode ? 'custom-select' : "bg-white text-black"}`}
                  popupClassName={'custom-dropdown'}
                  allowClear
                >
                  {BOOK_CATEGORIES.map((cat) => (
                    <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                  ))}
                </Select>

                <Select
                  placeholder="Filter by Status"
                  value={status}
                  onChange={(value) => setStatus(value)}
                  className={`w-full ${isDarkMode ? 'custom-select' : "bg-white text-black"}`}
                  popupClassName={'custom-dropdown'}
                  allowClear
                >
                  {READ_STATUS.map((stat) => (
                    <Option key={stat.value} value={stat.value}>{stat.label}</Option>
                  ))}
                </Select>
              </div>
            </div>

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Book
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-500 text-white p-6 rounded shadow flex items-center">
              <FontAwesomeIcon icon={faBook} className="text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Total Books</h3>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
            <div className="bg-yellow-500 text-white p-6 rounded shadow flex items-center">
              <FontAwesomeIcon icon={faBookOpen} className="text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Being Read</h3>
                <p className="text-2xl font-bold">{stats.reading}</p>
              </div>
            </div>
            <div className="bg-green-500 text-white p-6 rounded shadow flex items-center">
              <FontAwesomeIcon icon={faCheckCircle} className="text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Finished Read</h3>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </div>
          {loadingTable ?
            <>
              <TableSkeleton />
            </>
            :
            <>
              <Table
                columns={columns}
                dataSource={books}
                pagination={false}
                rowKey="id"
                className={`w-full ${isDarkMode ? "custom-table" : "bg-white text-black"} rounded `}
                scroll={{ x: 'max-content', y: 400 }}
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "even-row" : "odd-row"
                }
              />
              <Pagination
                total={pagination.total}
                current={page}
                pageSize={pageSize}
                showSizeChanger
                onChange={handlePaginationChange}
                onShowSizeChange={(current, size) => handlePaginationChange(current, size)}
                className={`mt-4 text-center flex justify-end ${isDarkMode ? "custom-pagination custom-select" : "bg-white text-black"}`}
              />
            </>
          }
        </div>
        <ConfirmModal
          isVisible={deleteModalVisible}
          setIsVisible={setDeleteModalVisible}
          onConfirm={() => handleDelete(bookToDelete)}
          title="Confirm Delete"
          message="Are you sure you want to delete this post?"
          confirmText="Delete"
          confirmDanger={true}
          isDarkMode={isDarkMode}
          cancelText="Cancel"
        />
      </Content>
    </Container>
  );
}
