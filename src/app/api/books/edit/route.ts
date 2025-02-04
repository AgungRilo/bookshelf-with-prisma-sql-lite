import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const getString = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : null;
    };
    const getDate = (key: string) => {
      const value = getString(key);
      return value ? new Date(value) : null;
    };
    const id = getString("id");
    const title = getString("title");
    const author = getString("author");
    const category = getString("category");
    const status = getString("status");
    const isbn = getString("isbn") ?? undefined;
    const userId = getString("userId") ?? undefined;
    const note = getString("note") || "";

    // Pastikan `startReadingAt` dan `endReadingAt` bertipe string sebelum dikonversi ke Date
    const startReadingAt = getDate("startReadingAt");
    const endReadingAt = getDate("endReadingAt");

    const coverImage = formData.get("coverImage");

    // **Validasi input**: Semua field wajib kecuali `note`
    
    const existingBook = await prisma.book.findFirst({
      where: {
        isbn,
        userId,
        NOT: {
          id: id?.toString(), // Abaikan buku yang sedang diedit
        },
      },
    });

    if (existingBook) {
      return NextResponse.json(
        { error: "A book with this ISBN already exists." },
        { status: 409 } // 409 Conflict (ISBN sudah ada)
      );
    }
    // **Cek dan konversi `coverImage` jika ada perubahan**
    let coverImageBuffer: Buffer | undefined = undefined;
    if (coverImage instanceof Blob) {
      coverImageBuffer = Buffer.from(await coverImage.arrayBuffer());
    }
    if (!id || !title || !author || !category || !status || !isbn || !userId) {
      return NextResponse.json(
        { error: "All fields except note are required." },
        { status: 400 }
      );
    }
    // **Update Buku** (Gunakan `set` hanya jika `coverImage` ada)
    const updatedBook = await prisma.book.update({
      where: { id: id.toString() },
      data: {
        title,
        author,
        category,
        status,
        isbn,
        userId: userId, 
        startReadingAt,
        endReadingAt,
        ...(note !== undefined && { note }), // Update `note` hanya jika dikirim
        ...(coverImageBuffer !== undefined && { coverImage: { set: coverImageBuffer } }),
      },
    });

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update the book" },
      { status: 500 }
    );
  }
}
