'use client'
import { useEffect, useRef } from "react"
import BackToList from '@/app/components/backToList';
import Container from '@/app/components/container';
import { BookDetails, BooksFormValues } from '@/interface/interface';
import { Button, Form, Input, message, Modal, Select, Upload } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { READ_STATUS, BOOK_CATEGORIES } from '@/app/constant/constant';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { convertBytesToBase64, detectMimeType } from "@/app/utils/utils";
import LoadingScreen from "@/app/components/loadingScreen";
import { useAppSelector } from '@/redux/hooks';

export default function EditDashboardPage() {
    const [isModalVisibleConfirm, setIsModalVisibleConfirm] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [coverImageBase64, setCoverImageBase64] = useState<string>('');
    const [dataBook, setDataBook] = useState<BookDetails | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [readStatus, setReadStatus] = useState<any>(null);
    const router = useRouter();
    const { Option } = Select;
    const { id } = useParams();
    const userId = Number(useAppSelector((state) => state.auth.user?.id));

    const [form] = Form.useForm();
    const handleCancel = () => {
        if (isFormTouched) {
            setIsModalVisibleConfirm(true);
        } else {
            router.back();
        }
    }
    useEffect(() => {
        if (id) {
            fetchBookDetails(Number(id));
        }
    }, [id]);
    const fetchBookDetails = async (id: number) => {
        try {
            const response = await axios.get(`/api/books/detail/${id}`);
            const data = response.data

            setDataBook(response.data);
            if (response.data.coverImage) {
                // Konversi objek menjadi array
                const coverImageArray = Object.values(response.data.coverImage) as number[];
                // Ubah array menjadi Uint8Array
                const coverImageUint8Array = new Uint8Array(coverImageArray);
                const mimeType = detectMimeType(coverImageUint8Array)
                // Konversi ke Base64
                const base64 = convertBytesToBase64(coverImageUint8Array);
                const base64Image = `data:${mimeType};base64,${base64}`;
                // setCoverImageBase64(base64Image);
                const fileList = [
                    {
                        uid: '-1',
                        name: 'cover-image.png', // Nama file default
                        status: 'done',
                        url: base64Image, // Gunakan base64 untuk preview
                    },
                ];

                // Set nilai coverImage ke form
                form.setFieldsValue({
                    coverImage: fileList,
                });
            }
            form.setFieldsValue({
                title: data?.title,
                author: data.author,
                category: data.category,
                isbn: data.isbn,
                note: data.note,
                status: data.status,
                // coverImage:coverImageBase64
            });
            let filteredReadStatus = READ_STATUS.filter(
                (status) =>
                    !(data.status === "unread" && status.value === "completed") &&
                    !(data.status === "reading" && status.value === "unread")
            );
            // Jika ingin mengubah state berdasarkan kondisi
            setReadStatus(filteredReadStatus);
        } catch (error) {
            console.error('Failed to fetch book details:', error);
            setError('Failed to fetch book details');
        } finally {
            setLoading(false);
        }
    };
    const handleFormChange = () => {
        setIsFormTouched(true);
    };
    const convertFileToArrayBuffer = (file: File): Promise<Uint8Array> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                resolve(new Uint8Array(arrayBuffer)); // Konversi ke Uint8Array
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file); // Konversi file ke ArrayBuffer
        });
    };
    const handleFinish = async (values: BooksFormValues) => {
        try {
            setIsSubmitting(true);
            let coverImageBytes;
    
            // **Cek apakah user mengunggah gambar baru**
            const coverImageFile = values.coverImage?.[0]?.originFileObj;
    
            if (coverImageFile) {
                // Jika ada file baru, konversi ke Uint8Array
                coverImageBytes = await convertFileToArrayBuffer(coverImageFile);
            } else if (dataBook?.coverImage) {
                // Jika tidak ada file baru, gunakan coverImage dari database
                coverImageBytes = dataBook.coverImage;
            }
    
            // **Siapkan payload**
            const gmt7Date = new Date(Date.now() + 7 * 60 * 60 * 1000); // Waktu GMT+7
    
            const payload = {
                id: Number(id),
                userId: Number(userId), // Pastikan userId dikirim sebagai integer
                title: values.title,
                author: values.author,
                category: values.category,
                status: values.status,
                isbn: values.isbn,
                coverImage: coverImageBytes instanceof Uint8Array 
                    ? Array.from(coverImageBytes) 
                    : coverImageBytes, // Kirim hanya jika ada gambar
                note: values.note || "", // Note tetap dikirim meskipun kosong
                startReadingAt: values.status === "reading" ? gmt7Date : dataBook?.startReadingAt,
                endReadingAt: values.status === "completed" ? gmt7Date : dataBook?.endReadingAt,
            };
    
            console.log("Payload being sent:", payload);
    
            // **Kirim data ke backend**
            const response = await axios.put('/api/books/edit', payload);
    
            if (response.status === 200) {
                message.success("Book updated successfully!");
                setIsModalVisible(true);
                setIsSubmitting(false);
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error("Error submitting the book:", error);
            setIsSubmitting(false);
            message.error(
                error.response?.data?.error || "Failed to update book. Please try again."
            );
        }
    };
    
    if (loading) {
        return <LoadingScreen />;
    }
    return (
        <Container>
            {/* <Modal
                title="Confirm Navigation"
                open={isModalVisibleConfirm}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <p>Are you sure you want to leave this page? Unsaved changes will be lost.</p>
            </Modal> */}
            {/* <Modal
                title="Success"
                open={isModalVisible}
                onOk={handleOk}
                closable={false}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <p>The book has been successfully edited!</p>
            </Modal> */}
            <div style={{ height: '90vh' }}>
                <Content className="m-4" style={{
                    overflowY: 'auto', // Mengaktifkan scrolling
                    maxHeight: 'calc(90vh - 64px)', // Sesuaikan dengan header jika ada
                    padding: '20px',
                    background: '#fff'
                }} >
                    <div className="p-4 bg-white rounded-md shadow-sm">
                        <h1 className="font-bold" style={{ fontSize: '24px' }}>
                            Edit Book
                        </h1>
                        <BackToList route='/dashboard' data />
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFinish}
                            // initialValues={{ status: "unread" }}
                            style={{ marginTop: '20px' }}
                            onValuesChange={handleFormChange}
                        >
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[
                                    { required: true, message: 'Title is required!' },
                                    { max: 100, message: 'Title must be less than 100 characters!' },
                                ]}
                            >
                                <Input placeholder="Please enter book title" />
                            </Form.Item>
                            <Form.Item
                                label="Author"
                                name="author"
                                rules={[
                                    { required: true, message: 'Title is required!' },
                                    { max: 100, message: 'Title must be less than 100 characters!' },
                                ]}
                            >
                                <Input placeholder="Please enter book author" />
                            </Form.Item>
                            <Form.Item
                                label="ISBN"
                                name="isbn"
                                rules={[
                                    { required: true, message: 'ISBN is required!' },
                                    {
                                        pattern: /^(?:\d{9}X|\d{10}|\d{13})$/,
                                        message: "Invalid ISBN! Must be ISBN-10 or ISBN-13 format.",
                                    },
                                ]}
                                normalize={(value) => value.replace(/[-\s]/g, "")}
                            >
                                <Input placeholder="Please enter book ISBN" />
                            </Form.Item>
                            <Form.Item
                                label="Cover Image"
                                name="coverImage"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please upload a cover image!",
                                    },
                                ]}
                            >
                                <Upload
                                    accept="image/jpeg,image/png"
                                    listType="picture-card"
                                    beforeUpload={(file) => {
                                        const isValidSize = file.size / 1024 / 1024 < 2; // Batasi ukuran file <= 2MB
                                        if (!isValidSize) {
                                            message.error("Image must be smaller than 2MB!");
                                        }
                                        return isValidSize || Upload.LIST_IGNORE; // Ignore jika terlalu besar
                                    }}
                                    showUploadList={{
                                        showPreviewIcon: false, // Hilangkan tombol preview
                                    }}
                                    maxCount={1}
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: "Please select a category!" }]}
                            >
                                <Select placeholder="Select a category" loading={!BOOK_CATEGORIES.length}>
                                    {BOOK_CATEGORIES.map((category) => (
                                        <Option key={category.value} value={category.value}>
                                            {category.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Read Status"
                                name="status"
                                rules={[{ required: true, message: "Please select a read status!" }]}
                            >
                                <Select disabled={dataBook?.status === 'completed'} placeholder="Select a read status">
                                    {readStatus.map((status: any) => (
                                        <Option key={status.value} value={status.value}>
                                            {status.label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Note"
                                name="note"
                                rules={[{ required: false, message: "" }]}
                            >
                                <Input.TextArea placeholder="Please enter book note" />
                            </Form.Item>

                            <div className="flex justify-end gap-4">
                                <Button onClick={handleCancel}>Cancel</Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                >
                                    Edit Post
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Content>
            </div>
        </Container>
    )
}