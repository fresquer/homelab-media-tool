import { NextRequest, NextResponse } from 'next/server';
import { getDb, Category } from '@/lib/db';
import { copyFile } from '@/lib/fileOperations';
import { buildDestPath } from '@/lib/jellyfinNaming';
import path from 'path';

type OrganizeBody = {
  sourcePath: string;      // ruta completa del archivo en descargas
  categoryId: number;
  title: string;
  year: number | null;
  season: number | null;
  episode: number | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as OrganizeBody;
    const { sourcePath, categoryId, title, year, season, episode } = body;

    if (!sourcePath || !categoryId || !title) {
      return NextResponse.json({ error: 'sourcePath, categoryId and title are required' }, { status: 400 });
    }

    const db = getDb();
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId) as Category | undefined;
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    const ext = path.extname(sourcePath).toLowerCase();
    const destPath = buildDestPath({ title, year, season, episode, ext, category });

    await copyFile(sourcePath, destPath);

    db.prepare(
      'INSERT INTO history (original_name, original_path, dest_path, category_id) VALUES (?, ?, ?, ?)'
    ).run(path.basename(sourcePath), sourcePath, destPath, categoryId);

    return NextResponse.json({ ok: true, destPath });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error organizing file' }, { status: 500 });
  }
}
