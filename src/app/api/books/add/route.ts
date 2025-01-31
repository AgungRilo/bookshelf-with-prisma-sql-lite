import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Pastikan request menggunakan multipart/form-data
    const formData = await req.formData();

    // Helper function untuk mengambil string dari FormData
    const getString = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : null;
    };

    const title = getString("title");
    const author = getString("author");
    const category = getString("category");
    const status = getString("status");
    const isbn = getString("isbn");
    const userIdValue = getString("userId");
    const note = getString("note") || "";

    const userId = userIdValue;

    // Validasi input
    if (!title || !author || !category || !status || !isbn || !userId) {
      return NextResponse.json(
        { error: "All fields except note are required." },
        { status: 400 }
      );
    }

    // Ambil file coverImage jika ada
    const coverImage = formData.get("coverImage");
    let coverImageBuffer: Uint8Array = new Uint8Array(0); // Default ke array kosong

    if (coverImage instanceof Blob) {
      coverImageBuffer = new Uint8Array(await coverImage.arrayBuffer()); // Konversi ke Uint8Array
    }

    // Simpan ke database
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        category,
        status,
        isbn,
        note,
        userId,
        coverImage: coverImageBuffer, // Pastikan ini selalu `Uint8Array`
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add the book" },
      { status: 500 }
    );
  }
}
