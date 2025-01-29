import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Valid Book ID is required' },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: {
        id: parseInt(id, 10),
      },
      select: {
        id: true,
        title: true,
        author: true,
        category: true,
        status: true,
        isbn: true,
        coverImage: true,
        note: true,
        createdAt: true,
        startReadingAt: true,
        endReadingAt: true,
      },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch book details. Please try again later.' },
      { status: 500 }
    );
  }
}
