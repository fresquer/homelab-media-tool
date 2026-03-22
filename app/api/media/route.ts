import { NextResponse } from 'next/server';
import { getDb, Category } from '@/lib/db';
import { listDirs } from '@/lib/fileOperations';
import path from 'path';

export async function GET() {
  try {
    const db = getDb();
    const categories = db.prepare('SELECT * FROM categories ORDER BY id').all() as Category[];

    const mediaTree = categories.map((cat) => {
      const titles = listDirs(cat.path);
      return {
        category: cat,
        titles: titles.map((title) => {
          const titlePath = path.posix.join(cat.path, title);
          const seasons = listDirs(titlePath);
          return { title, seasons };
        }),
      };
    });

    return NextResponse.json(mediaTree);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error reading media' }, { status: 500 });
  }
}
