import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const {
      id,
      title,
      author,
      category,
      status,
      isbn,
      coverImage,
      note,
    } = await req.json();

    // Validasi input
    if (!id || !title || !author || !category || !status || !isbn) {
      return NextResponse.json(
        { error: 'All fields except coverImage are required.' },
        { status: 400 }
      );
    }

    // Update buku berdasarkan ID
    const updatedBook = await prisma.book.update({
      where: {
        id: parseInt(id, 10), // Pastikan id diubah ke angka
      },
      data: {
        title,
        author,
        category,
        status,
        isbn,
        coverImage: coverImage ? Buffer.from(coverImage, 'base64') : null, // Simpan coverImage sebagai buffer jika ada
        note,
      },
    });

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to update the book' },
      { status: 500 }
    );
  }
}
