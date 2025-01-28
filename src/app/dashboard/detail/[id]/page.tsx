'use client'
import BackToList from "@/app/components/backToList";
import Container from "@/app/components/container";
import { message, Modal, Tag, Image, Button } from "antd";
import { Content } from "antd/es/layout/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import LoadingScreen from "@/app/components/loadingScreen";
import ReadingProgressModal from "@/app/components/readingProgressModal";
import { BookDetails } from "@/interface/interface";
import { useRouter } from 'next/navigation';
import { convertBytesToBase64, detectMimeType } from "@/app/utils/utils";
import { BOOK_CATEGORIES, READ_STATUS } from "@/app/constant/constant";

export default function AddDashboardPage() {
    const { id } = useParams();
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [readingModalVisible, setReadingModalVisible] = useState<boolean>(false);
    const [data, setData] = useState<BookDetails | null>(null);
    const [coverImageBase64, setCoverImageBase64] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        if (id) {
            fetchBookDetails(Number(id));
        }
    }, [id]);

    const fetchBookDetails = async (id: number) => {
        try {
            const response = await axios.get(`/api/books/detail/${id}`);
            setData(response.data);
            if (response.data.coverImage) {
                // Konversi objek menjadi array
                const coverImageArray = Object.values(response.data.coverImage) as number[];
                // Ubah array menjadi Uint8Array
                const coverImageUint8Array = new Uint8Array(coverImageArray);
                const mimeType = detectMimeType(coverImageUint8Array)
                // Konversi ke Base64
                const base64 = convertBytesToBase64(coverImageUint8Array);
                const base64Image = `data:${mimeType};base64,${base64}`;
                setCoverImageBase64(base64Image);
            }
        } catch (error) {
            message.error('Failed to fetch book details');
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (bookId: number) => {
        setDeleteModalVisible(false);
        try {
            await axios.delete(`/api/books/delete?id=${bookId}`);
            message.success('Book deleted successfully');
            router.push("/dashboard");
        } catch (error) {
            message.error('Failed to delete book');
        }
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

    const statusLabel = READ_STATUS.find((status) => status.value === data?.status)?.label || "-";
    const categoryLabel = BOOK_CATEGORIES.find((category) => category.value === data?.category)?.label || "-";

    return (
        <Container>
            <Modal
                title="Confirm Delete"
                open={deleteModalVisible}
                onOk={() => handleDelete(Number(id))}
                onCancel={() => setDeleteModalVisible(false)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to delete this post?</p>
            </Modal>
            <ReadingProgressModal
                open={readingModalVisible}
                onClose={onClose}
                createdAt={data?.createdAt ?? null}
                startReadingAt={data?.startReadingAt ?? null}
                endReadingAt={data?.endReadingAt ?? null}
            />
            <Content className="m-4">
                <div className="p-4 bg-white rounded-md shadow-sm">
                    <div className="flex justify-between">
                        <h1 className="font-bold" style={{ fontSize: '24px' }}>
                            Detail Book
                        </h1>
                        <div className="flex gap-2">
                            <Button type="primary" onClick={() => router.push(`/dashboard/edit/${id}`)}>Edit</Button>
                            <Button type="primary" danger onClick={() => setDeleteModalVisible(true)}>
                                Delete
                            </Button>
                        </div>
                    </div>
                    <BackToList route='/dashboard' data onClick={onOpen} />
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Kolom 1 (Text Information) */}
                        <div>
                            <h2 className="font-bold">Title</h2>
                            <h2>{data?.title || "-"}</h2>

                            <h2 className="font-bold mt-4">Author</h2>
                            <h2>{data?.author || "-"}</h2>

                            <h2 className="font-bold mt-4">Category</h2>
                            <h2>{data?.category ? <Tag color="blue">{categoryLabel}</Tag> : "-"}</h2>

                            <h2 className="font-bold mt-4">Status</h2>
                            <h2>
                                {data?.status ? (
                                    <Tag color={data.status === "completed" ? "green" : data.status === "reading" ? "yellow" : "red"}>
                                        {statusLabel}
                                    </Tag>
                                ) : (
                                    "-"
                                )}
                            </h2>
                        </div>

                        {/* Kolom 2 (Cover Image dan Note) */}
                        <div>
                            <h2 className="font-bold">Cover Image</h2>
                            <Image width={200} src={coverImageBase64} alt={`Cover of ${data?.title}`} />

                            <h2 className="font-bold mt-4">Note</h2>
                            <h2>{data?.note || "-"}</h2>
                        </div>
                    </div>
                </div>
            </Content>
        </Container>
    )
}