'use client'
import { useEffect } from "react"
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
import { convertBytesToBase64, convertFileToArrayBuffer, detectMimeType } from "@/app/utils/utils";
import LoadingScreen from "@/app/components/loadingScreen";
import { useAppSelector } from '@/redux/hooks';
import ReadingProgressModal from "@/app/components/readingProgressModal";
import { useTheme } from "@/context/ThemeContext";
import ConfirmModal from "@/app/components/modalConfirmation";
import ModalSuccess from "@/app/components/modalSucces";

export default function EditDashboardPage() {
    const [isModalVisibleConfirm, setIsModalVisibleConfirm] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [dataBook, setDataBook] = useState<BookDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [readStatus, setReadStatus] = useState<any>(null);
    const [readingModalVisible, setReadingModalVisible] = useState<boolean>(false);
    const { Option } = Select;
    const { id } = useParams();
    const [form] = Form.useForm();
    const router = useRouter();
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const userId = useAppSelector((state) => state.auth.user?.id);
    const handleCancel = () => {
        if (isFormTouched) {
            setIsModalVisibleConfirm(true);
        } else {
            router.back();
        }
    }
    useEffect(() => {
        if (id && typeof id === 'string') {
            fetchBookDetails(id);
        }
    }, [id]);
    const fetchBookDetails = async (id: string) => {
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
            });
            let filteredReadStatus = READ_STATUS.filter(
                (status) =>
                    !(data.status === "unread" && status.value === "completed") &&
                    !(data.status === "reading" && status.value === "unread")
            );
            // Jika ingin mengubah state berdasarkan kondisi
            setReadStatus(filteredReadStatus);
        } catch (error) {
            message.error('Failed to fetch book details')
        } finally {
            setLoading(false);
        }
    };
    const handleFormChange = () => {
        setIsFormTouched(true);
    };

    const handleFinish = async (values: BooksFormValues) => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();

            formData.append("id", id.toString()); // Pastikan `id` dikirim sebagai string
            formData.append("userId", userId?.toString() || "");
            formData.append("title", values.title || "");
            formData.append("author", values.author || "");
            formData.append("category", values.category || "");
            formData.append("status", values.status || "");
            formData.append("isbn", values.isbn || "");
            formData.append("note", values.note || "");

            // Jika user mengunggah gambar baru, gunakan file tersebut
            if (values.coverImage?.[0]?.originFileObj) {
                formData.append("coverImage", values.coverImage[0].originFileObj);
            }

            // Tambahkan waktu membaca jika status berubah
            const gmt7Date = new Date(Date.now());
            if (values.status === "reading") {
                formData.append("startReadingAt", gmt7Date.toISOString());
            } else if (values.status === "completed") {
                formData.append("endReadingAt", gmt7Date.toISOString());
            }

            const response = await axios.put("/api/books/edit", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                message.success("Book updated successfully!");
                setIsModalVisible(true);
            }
        } catch (error: any) {
            message.error(error.response?.data?.error || "Failed to update book. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalCancel = () => {
        setIsModalVisibleConfirm(false);
    };

    const handleModalOk = () => {
        setIsModalVisibleConfirm(false);
        router.push('/dashboard');
    };

    const handleOk = () => {
        setIsModalVisible(false);
        router.push('/dashboard');
    };
    const onClose = () => {
        setReadingModalVisible(false);
    }

    const onOpen = () => {
        setReadingModalVisible(true);
    }
    if (loading) {
        return <LoadingScreen />;
    }
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
                onConfirm={handleModalOk}
                title="Success"
                message="The book has been successfully edited!"
                confirmText="OK"
                isDarkMode={isDarkMode}
                closable={false} // Tidak bisa ditutup tanpa tombol
            />

            <ReadingProgressModal
                isDarkMode={isDarkMode}
                open={readingModalVisible}
                onClose={onClose}
                createdAt={dataBook?.createdAt ?? null}
                startReadingAt={dataBook?.startReadingAt ?? null}
                endReadingAt={dataBook?.endReadingAt ?? null}
            />
            <div className={`${isDarkMode && "bg-[#3A4750]"} h-[90vh] px-8`} >
                <Content className={`m-4 overflow-y-auto max-h-[calc(90vh-64px)] rounded-md p-5 ${isDarkMode ? "bg-black" : "bg-white "} `}>
                    <div className={`p-4 ${isDarkMode ? "bg-black" : "bg-white "}  shadow-sm `}>
                        <h1 className="font-bold" style={{ fontSize: '24px' }}>
                            Edit Book
                        </h1>
                        <BackToList route="/dashboard" onCancel={handleCancel} data onClick={onOpen} />
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFinish}
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
                                <Select placeholder="Select a category" loading={!BOOK_CATEGORIES.length} className={`${isDarkMode ? 'custom-select' : "bg-white text-black"}`} popupClassName={`${isDarkMode ? 'custom-dropdown' : ""}`} >
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
                                <Select className={`${isDarkMode ? 'custom-select' : "bg-white text-black"}`} popupClassName={`${isDarkMode ? 'custom-dropdown' : ""}`} disabled={dataBook?.status === 'completed'} placeholder="Select a read status">
                                    {readStatus?.map((status: any) => (
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
                                    Edit Book
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Content>
            </div>
        </Container>
    )
}