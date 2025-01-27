export const BOOK_CATEGORIES = [
    { value: "fiction", label: "Fiction" },
    { value: "nonfiction", label: "Non-Fiction" },
    { value: "fantasy", label: "Fantasy" },
    { value: "biography", label: "Biography" },
    { value: "selfhelp", label: "Self-Help" },
    { value: "technologhy", label: "Technologhy" },
  ] as const;
  
  // Status Baca
  export const READ_STATUS = [
    { value: "unread", label: "Unread" },
    { value: "reading", label: "Reading" },
    { value: "completed", label: "Completed" },
  ] as const;
  
  // Jika Anda ingin membuat tipe untuk status atau kategori
  export type BookCategory = typeof BOOK_CATEGORIES[number]["value"];
  export type ReadStatus = typeof READ_STATUS[number]["value"];