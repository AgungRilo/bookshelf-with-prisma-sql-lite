import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { search, userId, page, limit, status, category } = Object.fromEntries(
      new URL(req.url).searchParams.entries()
    );

    if (!userId) {
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
      userId: userId,
    };

    // **Filter berdasarkan search (title & author)**
    if (search && search.trim() !== "") {
      whereClause.OR = [
        { title: { contains: search.trim().toLowerCase() } },
        { author: { contains: search.trim().toLowerCase() } },
      ];
    }

    // **Filter berdasarkan status**
    if (status && status.trim() !== "") {
      whereClause.status = status.trim().toLowerCase();
    }

    // **Filter berdasarkan category**
    if (category && category.trim() !== "") {
      whereClause.category = category.trim().toLowerCase();
    }


    const books = await prisma.book.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        author: true,
        category: true,
        status: true,
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
    return NextResponse.json(
      { error: 'Failed to fetch books. Please try again later.' },
      { status: 500 }
    );
  }
}
