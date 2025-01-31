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
    const id = getString("id");
    const title = getString("title");
    const author = getString("author");
    const category = getString("category");
    const status = getString("status");
    const isbn = getString("isbn");
    const userId = getString("userId");
    const note = getString("note") || "";

    // Pastikan `startReadingAt` dan `endReadingAt` bertipe string sebelum dikonversi ke Date
    const startReadingAtValue = getString("startReadingAt");
    const endReadingAtValue = getString("endReadingAt");

    const startReadingAt = (typeof startReadingAtValue === "string" && startReadingAtValue.trim() !== "")
        ? new Date(startReadingAtValue)
        : null;

    const endReadingAt = (typeof endReadingAtValue === "string" && endReadingAtValue.trim() !== "")
        ? new Date(endReadingAtValue)
        : null;

    const coverImage = formData.get("coverImage");

    // **Validasi input**: Semua field wajib kecuali `note`
    

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
        ...(coverImageBuffer && { coverImage: { set: coverImageBuffer } }), // Update hanya jika coverImage ada
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
