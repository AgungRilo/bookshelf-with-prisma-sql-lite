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
import { convertFileToArrayBuffer } from '@/app/utils/utils';
import { useTheme } from "@/context/ThemeContext";
import ConfirmModal from '@/app/components/modalConfirmation';
import ModalSuccess from '@/app/components/modalSucces';

export default function AddDashboardPage() {
    const [isModalVisibleConfirm, setIsModalVisibleConfirm] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const data = useAppSelector((state) => state.auth.user?.id);
    const router = useRouter();
    const { Option } = Select;
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

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
            setIsSubmitting(true);
            const formData = new FormData();

            formData.append("userId", data?.toString() || "");
            formData.append("title", values.title);
            formData.append("author", values.author);
            formData.append("category", values.category);
            formData.append("status", values.status);
            formData.append("isbn", values.isbn);
            formData.append("note", values.note || "");

            if (values.coverImage?.[0]?.originFileObj) {
                formData.append("coverImage", values.coverImage[0].originFileObj);
            }

            const response = await axios.post("/api/books/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                message.success("Book created successfully!");
                setIsModalVisible(true);
            }
        } catch (error: any) {
            message.error(error.response?.data?.error || "Failed to create book. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Container>
            <ConfirmModal
                isVisible={isModalVisibleConfirm}
                setIsVisible={setIsModalVisible}
                onConfirm={handleModalOk}
                title="Confirm Leave Page"
                message="Are you sure you want to leave this page? Unsaved changes will be lost."
                confirmText="Yes, leave this page"
                confirmDanger={true} // Tombol merah seperti `danger: true`
                cancelText="Cancel"
                isDarkMode={isDarkMode}
                onCancel={handleModalCancel}
                closable={false} // Tidak bisa ditutup tanpa tombol
            />
            <ModalSuccess
                isVisible={isModalVisible}
                setIsVisible={setIsModalVisible}
                onConfirm={handleOk}
                title="Success"
                message="The book has been successfully added!"
                confirmText="OK"
                isDarkMode={isDarkMode}
                closable={false} // Tidak bisa ditutup tanpa tombol
            />
            <div className={`${isDarkMode && "bg-[#3A4750]"} h-[90vh] px-8`} >

                <Content className={`m-4 overflow-y-auto max-h-[calc(90vh-64px)] rounded-md p-5 ${isDarkMode ? "bg-black" : "bg-white "} `}>
                    <div className={`p-4 ${isDarkMode ? "bg-black" : "bg-white "}  shadow-sm `}>
                        <h1 className="font-bold" style={{ fontSize: '24px' }}>
                            Add Book
                        </h1>
                        <BackToList route="/dashboard" onCancel={handleCancel} />
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
                                    { required: true, message: "Title is required!" },
                                    { max: 100, message: "Title must be less than 100 characters!" },
                                ]}
                            >
                                <Input placeholder="Please enter book title" />
                            </Form.Item>
                            <Form.Item
                                label="Author"
                                name="author"
                                rules={[
                                    { required: true, message: "Author is required!" },
                                    { max: 100, message: "Author must be less than 100 characters!" },
                                ]}
                            >
                                <Input placeholder="Please enter book author" />
                            </Form.Item>
                            <Form.Item
                                label="ISBN"
                                name="isbn"
                                rules={[
                                    { required: true, message: "ISBN is required!" },
                                    {
                                        pattern: /^(97(8|9))?\d{9}(\d|X)$/,
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
                                    { required: true, message: "Please upload a cover image!" },
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
                                <Select className={`${isDarkMode ? 'custom-select' : "bg-white text-black"}`} popupClassName={`${isDarkMode ? 'custom-dropdown' : ""}`} placeholder="Select a category" loading={!BOOK_CATEGORIES.length}>
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
                                <Select className={`${isDarkMode ? 'custom-select' : "bg-white text-black"}`} popupClassName={`${isDarkMode ? 'custom-dropdown' : ""}`} disabled placeholder="Select a read status">
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
                                rules={[
                                    { required: false },
                                    { max: 500, message: "Note must be less than 500 characters!" },
                                ]}
                            >
                                <Input.TextArea placeholder="Please enter book note" />
                            </Form.Item>

                            <div className="flex justify-end gap-4">
                                <Button
                                    loading={isSubmitting}
                                    onClick={handleCancel}
                                    className='text-black'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                >
                                    Add Post
                                </Button>
                            </div>

                        </Form>
                    </div>

                </Content>
            </div>
        </Container>
    )
}