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
    // coverImage: string;
    readStatus: string;
    note?: string;
    createdAt?: string;
    startReadingAt?: string;
    endReadingAt?: string;
}

export interface BookDetails {
    id: string;
    title: string;
    author: string;
    category: string;
    status: string;
    isbn: string;
    coverImage: string; // Base64 string
    note?: string;
    createdAt: string;
    startReadingAt?: string;
    endReadingAt?: string;
}