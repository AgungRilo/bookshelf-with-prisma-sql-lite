import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Pastikan request menggunakan multipart/form-data
    const formData = await req.formData();
    const getString = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : null;
    };

    const title = getString("title");
    const author = getString("author");
    const category = getString("category");
    const status = getString("status");
    const isbn = getString("isbn");
    const userId = getString("userId");
    const note = getString("note") || "";

    const coverImage = formData.get("coverImage");



    // Konversi file coverImage ke Buffer
    let coverImageBuffer: Uint8Array | undefined = undefined;
    if (coverImage instanceof Blob) {
      coverImageBuffer = new Uint8Array(await coverImage.arrayBuffer());
    }
    // Validasi input
    if (!title || !author || !category || !status || !isbn || !userId || !coverImage) {
      return NextResponse.json(
        { error: "All fields except note are required." },
        { status: 400 }
      );
    }
    // Simpan ke database
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        category,
        status,
        isbn,
        ...(coverImageBuffer && { coverImage: coverImageBuffer }),
        note,
        userId, // Pastikan userId dalam format integer
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to add the book" },
      { status: 500 }
    );
  }
}
