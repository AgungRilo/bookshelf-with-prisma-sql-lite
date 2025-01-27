'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Button, Table, Tag, Input, Space, Pagination, message, Skeleton, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LoadingScreen from '../components/loadingScreen';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Container from '../components/container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faBook, faBookOpen, faCheckCircle, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BooksFormValues } from '@/interface/interface';
import { useAppSelector } from '@/redux/hooks';
import { SearchOutlined } from '@ant-design/icons';
import TableSkeleton from '../components/skeletonTable';
const { Content } = Layout;
const { Search } = Input;

export default function DashboardPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);

  const [books, setBooks] = useState<BooksFormValues[]>([]);
  const [search, setSearch] = useState<string>(''); // Input langsung dari pengguna
  const [debouncedSearch, setDebouncedSearch] = useState<string>(''); // Nilai pencarian dengan debounce
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
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

  const fetchBooks = async (userId: number, page: number, limit: number, search: string) => {

    try {
      setLoadingTable(true);
      const response = await axios.get('/api/books/list', {
        params: {
          userId,
          page,
          limit,
          search,
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
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/user/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset ke halaman pertama saat pencarian
  };

  // Debounce untuk input pencarian
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search); // Update nilai debounced setelah delay
      setPage(1);
    }, 500);

    return () => {
      clearTimeout(handler); // Bersihkan timeout jika input berubah sebelum selesai
    };
  }, [search]);

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  useEffect(() => {
    if (userId) {
      fetchBooks(Number(userId), page, pageSize, debouncedSearch);
    }
  }, [userId, page, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAdd = () => {
    router.push('/dashboard/add');
  };

  const handleEdit = (bookId: number) => {
    router.push(`/dashboard/edit/${bookId}`);
  };

  const handleDelete = async (bookId: number) => {
    setDeleteModalVisible(false);
    try {
      // Kirim ID sebagai query parameter
      await axios.delete(`/api/books/delete?id=${bookId}`);
      message.success('Book deleted successfully');
      fetchBooks(Number(userId), page, pageSize, search); // Refresh list
    } catch (error) {
      console.error('Failed to delete book:', error);
      message.error('Failed to delete book');
    }
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
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        const color = text === 'completed' ? 'green' : text === 'reading' ? 'orange' : 'red';
        return <Tag color={color}>{text}</Tag>;
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
            onClick={() => handleDelete(record.id)}
            icon={faArrowCircleRight}
            className="text-xl text-blue-500 cursor-pointer"
          />
        </Space>
      ),
    },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <Content className="m-4">
        <div className="p-4 bg-white rounded-md shadow-sm">
          <h1 className="font-bold" style={{ fontSize: '24px' }}>
            Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6 gap-4">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by Title or Author"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
              className="w-full sm:w-auto"
            />
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
                className="w-full"
                scroll={{ x: 'max-content', y: 400 }}
              />
              <Pagination
                total={pagination.total}
                current={page}
                pageSize={pageSize}
                showSizeChanger
                onChange={handlePaginationChange}
                onShowSizeChange={(current, size) => handlePaginationChange(current, size)}
                className="mt-4 text-center flex justify-end"
              />
            </>
          }
        </div>
        <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={()=>handleDelete(Number(bookToDelete))}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this post?</p>
      </Modal>
      </Content>
    </Container>
  );
}
