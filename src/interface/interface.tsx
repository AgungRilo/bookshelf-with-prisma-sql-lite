export interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
}

export interface BooksFormValues {
    title: string;
    author: string;
    category: string;
    status: string;
    isbn: string;
    coverImage: { originFileObj: File }[];
    readStatus: string;
    note?: string;
    createdAt?: string;
    startReadingAt?: string;
    endReadingAt?: string;
}