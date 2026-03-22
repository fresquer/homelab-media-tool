import { NextRequest, NextResponse } from 'next/server';
import { getDb, Category } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const categories = db.prepare('SELECT * FROM categories ORDER BY id').all() as Category[];
    return NextResponse.json(categories);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error reading categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Omit<Category, 'id'>;
    const { name, path, type, icon } = body;
    if (!name || !path || !type) {
      return NextResponse.json({ error: 'name, path and type are required' }, { status: 400 });
    }
    const db = getDb();
    const result = db
      .prepare('INSERT INTO categories (name, path, type, icon) VALUES (?, ?, ?, ?)')
      .run(name, path, type, icon ?? 'folder');
    return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const db = getDb();
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error deleting category' }, { status: 500 });
  }
}
