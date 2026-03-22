'use client';

import { useState, useEffect } from 'react';
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

type Props = {
  file: FileInfo | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: (destPath: string) => void;
};

export default function OrganizeModal({ file, categories, onClose, onSuccess }: Props) {
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<string>('');
  const [season, setSeason] = useState<string>('');
  const [episode, setEpisode] = useState<string>('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) return;
    const p = file.parsed;
    setTitle(p.title);
    setYear(p.year?.toString() ?? '');
    setSeason(p.season?.toString() ?? '');
    setEpisode(p.episode?.toString() ?? '');
    setError('');
    if (categories.length > 0) {
      const defaultCat = categories.find((c) =>
        p.isSeries ? c.type !== 'movie' : c.type === 'movie'
      );
      setCategoryId(defaultCat?.id ?? categories[0].id);
    }
  }, [file, categories]);

  useEffect(() => {
    if (!file || !categoryId || !title) { setPreview(''); return; }
    const cat = categories.find((c) => c.id === Number(categoryId));
    if (!cat) return;

    const ext = file.ext;
    const yr = year ? parseInt(year) : null;
    const se = season ? parseInt(season) : null;
    const ep = episode ? parseInt(episode) : null;

    let prev = '';
    if (cat.type === 'movie') {
      const folder = yr ? `${title} (${yr})` : title;
      prev = `${cat.path}/${folder}/${folder}${ext}`;
    } else {
      const s = String(se ?? 1).padStart(2, '0');
      const e = String(ep ?? 1).padStart(2, '0');
      prev = `${cat.path}/${title}/Season ${s}/${title} - S${s}E${e}${ext}`;
    }
    setPreview(prev);
  }, [categoryId, title, year, season, episode, file, categories]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !categoryId || !title) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourcePath: file.path,
          categoryId: Number(categoryId),
          title,
          year: year ? parseInt(year) : null,
          season: season ? parseInt(season) : null,
          episode: episode ? parseInt(episode) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error desconocido');
      onSuccess(data.destPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al organizar');
    } finally {
      setLoading(false);
    }
  }

  if (!file) return null;

  const selectedCat = categories.find((c) => c.id === Number(categoryId));
  const isSeries = selectedCat?.type !== 'movie';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-zinc-700">
          <h2 className="text-white font-semibold text-lg">Organizar archivo</h2>
          <p className="text-zinc-400 text-sm mt-0.5 truncate">{file.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-zinc-300 text-sm mb-1">Categoría destino</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              required
            >
              <option value="">Seleccionar...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-300 text-sm mb-1">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-zinc-300 text-sm mb-1">Año</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
                className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            {isSeries && (
              <>
                <div className="flex-1">
                  <label className="block text-zinc-300 text-sm mb-1">Temporada</label>
                  <input
                    type="number"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    placeholder="1"
                    min={1}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-zinc-300 text-sm mb-1">Episodio</label>
                  <input
                    type="number"
                    value={episode}
                    onChange={(e) => setEpisode(e.target.value)}
                    placeholder="1"
                    min={1}
                    className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}
          </div>

          {preview && (
            <div className="bg-zinc-800 rounded-md p-3">
              <p className="text-zinc-400 text-xs mb-1">Destino</p>
              <p className="text-indigo-300 text-xs font-mono break-all">{preview}</p>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md py-2 text-sm transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !categoryId || !title}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md py-2 text-sm font-medium transition-colors"
            >
              {loading ? 'Copiando...' : 'Copiar a media'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
