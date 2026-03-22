'use client';

import { useEffect, useState, useCallback } from 'react';
import FileCard from '@/components/FileCard';
import OrganizeModal from '@/components/OrganizeModal';
import type { ParsedFile } from '@/lib/fileParser';
import type { Category } from '@/lib/db';

type FileInfo = {
  name: string;
  path: string;
  size: number;
  mtime: string;
  ext: string;
  parsed: ParsedFile;
};

export default function DownloadsPage() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [downloadsPath, setDownloadsPath] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/files');
    const data = await res.json();
    setFiles(data.files ?? []);
    setDownloadsPath(data.downloadsPath ?? '');
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFiles();
    fetch('/api/categories').then((r) => r.json()).then(setCategories);
  }, [fetchFiles]);

  function handleSuccess(destPath: string) {
    setSelected(null);
    setToast(`Copiado a: ${destPath}`);
    setTimeout(() => setToast(null), 4000);
    fetchFiles();
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Descargas</h1>
          {downloadsPath && (
            <p className="text-zinc-500 text-sm mt-0.5 font-mono">{downloadsPath}</p>
          )}
        </div>
        <button
          onClick={fetchFiles}
          className="text-zinc-400 hover:text-white text-sm border border-zinc-600 hover:border-zinc-400 rounded-md px-3 py-1.5 transition-colors"
        >
          Actualizar
        </button>
      </div>

      {!loading && !downloadsPath && (
        <div className="mb-6 bg-amber-900/40 border border-amber-700 rounded-lg px-5 py-4 flex items-start gap-3">
          <span className="text-amber-400 text-xl mt-0.5">⚠</span>
          <div>
            <p className="text-amber-300 font-medium text-sm">Rutas no configuradas</p>
            <p className="text-amber-400/80 text-sm mt-1">
              Ve a{' '}
              <a href="/settings" className="underline hover:text-amber-200">Ajustes</a>
              {' '}y configura la carpeta de descargas.
              Dentro del contenedor el host está montado en <code className="font-mono bg-amber-900/60 px-1 rounded">/host</code>,
              así que usa rutas como <code className="font-mono bg-amber-900/60 px-1 rounded">/host/ruta/a/downloads</code>.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-zinc-500 text-sm">Cargando archivos...</div>
      ) : !downloadsPath ? null : files.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">
          <p className="text-4xl mb-3">📂</p>
          <p>No hay archivos multimedia en la carpeta de descargas.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <FileCard key={file.path} file={file} onOrganize={setSelected} />
          ))}
        </div>
      )}

      <OrganizeModal
        file={selected}
        categories={categories}
        onClose={() => setSelected(null)}
        onSuccess={handleSuccess}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-700 text-white text-sm px-4 py-3 rounded-lg shadow-lg max-w-sm break-all">
          {toast}
        </div>
      )}
    </main>
  );
}
