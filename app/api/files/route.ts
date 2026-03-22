import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { listFiles, MEDIA_EXTENSIONS } from '@/lib/fileOperations';
import { parseFilename } from '@/lib/fileParser';

export async function GET() {
  try {
    const db = getDb();
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('downloads_path') as { value: string } | undefined;
    const downloadsPath = row?.value ?? '/downloads';

    const files = listFiles(downloadsPath)
      .filter((f) => MEDIA_EXTENSIONS.has(f.ext))
      .map((f) => ({
        ...f,
        parsed: parseFilename(f.name),
      }));

    return NextResponse.json({ files, downloadsPath });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error listing files' }, { status: 500 });
  }
}
