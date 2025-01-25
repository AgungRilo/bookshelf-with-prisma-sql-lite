import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Validasi input
    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Hapus buku berdasarkan ID
    const deletedBook = await prisma.book.delete({
      where: {
        id: parseInt(id, 10), // Pastikan id diubah ke angka
      },
    });

    return NextResponse.json(
      { message: 'Book deleted successfully', book: deletedBook },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to delete the book' },
      { status: 500 }
    );
  }
}
