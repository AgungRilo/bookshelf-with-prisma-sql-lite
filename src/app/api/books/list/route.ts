import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  console.log('API Hit: /api/books/list');
  console.log('Request URL:', req.url);
  try {

    const { search, userId, page, limit } = Object.fromEntries(
      new URL(req.url).searchParams.entries()
    );
    console.log("Request params:", { search, userId, page, limit });


    console.log('Query Parameters:', { search, userId, page, limit });

    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json(
        { error: 'Valid User ID is required' },
        { status: 400 }
      );
    }

    const currentPage = parseInt(page || '1', 10);
    const pageSize = parseInt(limit || '10', 10);

    if (currentPage < 1 || pageSize < 1) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const offset = (currentPage - 1) * pageSize;

    const whereClause: any = {
      userId: parseInt(userId, 10),
    };
    console.log("search",search)
    if (search && search.trim() !== "") {
      whereClause.OR = [
        { title: { contains: search.trim().toLowerCase() } },
        { author: { contains: search.trim().toLowerCase() } },
      ];
    }

    console.log('Where clause:', JSON.stringify(whereClause, null, 2));

    const books = await prisma.book.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        title: true,
        author: true,
        category: true,
        status: true,
        // isbn: true,
        // coverImage: true,
        // note: true,
        // createdAt: true,
        // startReadingAt: true,
        // endReadingAt: true,
      },
    });

    const totalBooks = await prisma.book.count({ where: whereClause });

    return NextResponse.json({
      data: books,
      pagination: {
        total: totalBooks,
        currentPage,
        totalPages: Math.ceil(totalBooks / pageSize),
        pageSize,
      },
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books. Please try again later.' },
      { status: 500 }
    );
  }
}
