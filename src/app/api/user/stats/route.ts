import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Ambil userId dari query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Validasi userId harus ada & berupa angka
    if (!userId) {
      return NextResponse.json(
        { error: "Valid userId is required" },
        { status: 400 }
      );
    }

    userId;

    // Query count hanya untuk user yang sedang login
    const totalBooks = await prisma.book.count({
      where: { userId: userId },
    });

    const readingBooks = await prisma.book.count({
      where: {
        userId: userId,
        status: "reading",
      },
    });

    const completedBooks = await prisma.book.count({
      where: {
        userId: userId,
        status: "completed",
      },
    });

    return NextResponse.json({
      total: totalBooks,
      reading: readingBooks,
      completed: completedBooks,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch book statistics" },
      { status: 500 }
    );
  }
}
