import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      title,
      author,
      category,
      status,
      isbn,
      coverImage,
      note,
      userId,
    } = await req.json();

    // Validasi input
    if (!title || !author || !category || !status || !isbn || !userId) {
      return NextResponse.json(
        { error: 'All fields except coverImage are required.' },
        { status: 400 }
      );
    }

    // Menambah buku baru
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        category,
        status,
        isbn,
        coverImage: coverImage ? Buffer.from(coverImage, 'base64') : null, // Simpan coverImage sebagai buffer jika ada
        note,
        userId,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to add the book' },
      { status: 500 }
    );
  }
}
