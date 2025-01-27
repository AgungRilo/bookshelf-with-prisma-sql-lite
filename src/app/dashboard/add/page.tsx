'use client';

import BackToList from '@/app/components/backToList';
import Container from '@/app/components/container';
import { BooksFormValues } from '@/interface/interface';
import { Button, Form, Input, message, Modal, Select, Upload } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { READ_STATUS, BOOK_CATEGORIES } from '@/app/constant/constant';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppSelector } from '@/redux/hooks';


export default function AddDashboardPage() {
    const [isModalVisibleConfirm, setIsModalVisibleConfirm] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
    const data = useAppSelector((state) => state.auth.user);
    const router = useRouter();
    const { Option } = Select;

    const handleFormChange = () => {
        setIsFormTouched(true);
    };

    const handleCancel = () => {
        if (isFormTouched) {
            setIsModalVisibleConfirm(true);
        } else {
            router.back();
        }
    }

    const handleModalOk = () => {
        setIsModalVisibleConfirm(false);
        router.back();
    };


    const handleOk = () => {
        setIsModalVisible(false);
        router.back();
    };

    const handleModalCancel = () => {
        setIsModalVisibleConfirm(false);
    };

    const handleFinish = async (values: BooksFormValues) => {
        try {
            console.log("Received values of form:", values);

            // Ambil file dari `originFileObj`
            const coverImageFile = values.coverImage[0]?.originFileObj;

            if (!coverImageFile) {
                message.error("Cover image file is missing or invalid.");
                return;
            }

            // Fungsi untuk konversi file ke ArrayBuffer (format Bytes)
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

            // Konversi coverImage ke Uint8Array
            const coverImageBytes = await convertFileToArrayBuffer(coverImageFile);

            // Siapkan payload untuk dikirim ke backend
            const payload = {
                userId: data?.id, // Pastikan `data` berasal dari context atau Redux
                title: values.title,
                author: values.author,
                category: values.category,
                status: values.status,
                isbn: values.isbn,
                coverImage: Array.from(coverImageBytes), // Ubah Uint8Array ke Array biasa
                note: values.note || "", // Catatan opsional
            };

            // Kirim data ke backend
            const response = await axios.post("/api/books/add", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Jika berhasil
            if (response.status === 201) {
                message.success("Book created successfully!");
                setIsModalVisible(true); // Tampilkan modal atau redirect
            }
        } catch (error: any) {
            console.error("Error submitting the book:", error);
            message.error(
                error.response?.data?.error || "Failed to create book. Please try again."
            );
        }
    };




    return (
        <Container>
            <Modal
                title="Confirm Navigation"
                open={isModalVisibleConfirm}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <p>Are you sure you want to leave this page? Unsaved changes will be lost.</p>
            </Modal>
            <Modal
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
                <p>The book has been successfully added!</p>
            </Modal>
            <Content className="m-4">
                <div className="p-4 bg-white rounded-md shadow-sm">
                    <h1 className="font-bold" style={{ fontSize: '24px' }}>
                        Add Book
                    </h1>
                    <BackToList route='/dashboard' />
                    <Form
                        layout="vertical"
                        onFinish={handleFinish}
                        initialValues={{ status: "unread" }}
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
                                accept="image/*" // Hanya gambar
                                listType="picture-card" // Tampilkan preview
                                beforeUpload={() => false} // Nonaktifkan upload otomatis
                                maxCount={1} // Batasi hanya 1 gambar
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
                            <Select disabled placeholder="Select a read status">
                                {READ_STATUS.map((status) => (
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
                            // loading={isSubmitting}
                            >
                                Add Post
                            </Button>
                        </div>
                    </Form>
                </div>
            </Content>
        </Container>
    )

}