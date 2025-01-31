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
      startReadingAt,
      endReadingAt,
      userId
    } = await req.json();

    // **Validasi input**: Semua field wajib kecuali `note`  opsional
    if (!id || !title || !author || !category || !status || !isbn || !userId) {
      return NextResponse.json(
        { error: 'All fields except note are required.' },
        { status: 400 }
      );
    }


    // **Cek dan konversi `coverImage` jika ada perubahan**
    let coverImageBuffer: Buffer | undefined = undefined;
    if (coverImage) {
      if (Array.isArray(coverImage)) {
        coverImageBuffer = Buffer.from(new Uint8Array(coverImage));
      } else if (coverImage instanceof Uint8Array) {
        coverImageBuffer = Buffer.from(coverImage);
      } else if (typeof coverImage === "string") {
        // Jika base64 string, ubah menjadi Buffer
        coverImageBuffer = Buffer.from(coverImage, 'base64');
      } 
    }


    // **Update Buku** (Gunakan `set` untuk coverImage)
    const updatedBook = await prisma.book.update({
      where: { id: id },
      data: {
        title,
        author,
        category,
        status,
        isbn,
        userId: userId,
        startReadingAt: startReadingAt ? new Date(startReadingAt) : null,
        endReadingAt: endReadingAt ? new Date(endReadingAt) : null,
        ...(note !== undefined && { note }), // Update `note` hanya jika dikirim
        ...(coverImageBuffer && { coverImage: { set: coverImageBuffer } }), // Update hanya jika coverImage ada
      },
    });


    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update the book' },
      { status: 500 }
    );
  }
}
