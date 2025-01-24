import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Query untuk mendapatkan count buku berdasarkan status
    const totalBooks = await prisma.book.count();
    const readingBooks = await prisma.book.count({
      where: {
        status: 'reading',
      },
    });
    const completedBooks = await prisma.book.count({
      where: {
        status: 'completed',
      },
    });

    return NextResponse.json({
      total: totalBooks,
      reading: readingBooks,
      completed: completedBooks,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch book statistics' },
      { status: 500 }
    );
  }
}
