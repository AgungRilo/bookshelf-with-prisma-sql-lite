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

    // Validasi input: Semua field wajib kecuali note
    if (!title || !author || !category || !status || !isbn || !userId || !coverImage) {
      return NextResponse.json(
        { error: 'All fields except note are required.' },
        { status: 400 }
      );
    }

    // Menambah buku baru ke database
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        category,
        status,
        isbn,
        coverImage: Buffer.from(coverImage),// Konversi Base64 menjadi Buffer
        note: note || '', // Default jika note tidak diisi
        userId,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add the book' },
      { status: 500 }
    );
  }
}
