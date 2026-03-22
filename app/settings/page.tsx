'use client';

import { useEffect, useState } from 'react';
import type { Category } from '@/lib/db';

const CATEGORY_TYPES = [
  { value: 'movie', label: 'Película' },
  { value: 'series', label: 'Serie' },
  { value: 'anime', label: 'Anime' },
];

const ICONS = ['film', 'tv', 'star', 'folder'];

export default function SettingsPage() {
  const [downloads, setDownloads] = useState('');
  const [mediaBase, setMediaBase] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState({ name: '', path: '', type: 'series', icon: 'folder' });
  const [catError, setCatError] = useState('');

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((s) => {
      setDownloads(s.downloads_path ?? '');
      setMediaBase(s.media_base_path ?? '');
    });
    fetch('/api/categories').then((r) => r.json()).then(setCategories);
  }, []);

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ downloads_path: downloads, media_base_path: mediaBase }),
    });
    setSaving(false);
    setSavedMsg('Guardado');
    setTimeout(() => setSavedMsg(''), 2000);
  }

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatError('');
    if (!newCat.name || !newCat.path) { setCatError('Nombre y ruta son obligatorios'); return; }
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    });
    if (!res.ok) { setCatError('Error al crear categoría'); return; }
    const { id } = await res.json();
    setCategories((prev) => [...prev, { ...newCat, id } as Category]);
    setNewCat({ name: '', path: '', type: 'series', icon: 'folder' });
  }

  async function deleteCategory(id: number) {
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold text-white">Ajustes</h1>

      {/* Rutas */}
      <section>
        <h2 className="text-white font-semibold text-lg mb-4">Rutas</h2>
        <form onSubmit={saveSettings} className="space-y-4">
          <div>
            <label className="block text-zinc-300 text-sm mb-1">Carpeta de descargas</label>
            <input
              value={downloads}
              onChange={(e) => setDownloads(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
              placeholder="/downloads"
            />
          </div>
          <div>
            <label className="block text-zinc-300 text-sm mb-1">Carpeta base de media</label>
            <input
              value={mediaBase}
              onChange={(e) => setMediaBase(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-md px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
              placeholder="/media"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-md transition-colors"
            >
              {saving ? 'Guardando...' : 'Guardar rutas'}
            </button>
            {savedMsg && <span className="text-green-400 text-sm">{savedMsg}</span>}
          </div>
        </form>
      </section>

      {/* Categorías */}
      <section>
        <h2 className="text-white font-semibold text-lg mb-4">Categorías de media</h2>

        <div className="space-y-2 mb-6">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-3 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3">
              <span className="text-zinc-300 text-sm flex-1">{c.name}</span>
              <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-0.5 rounded">{c.type}</span>
              <span className="text-zinc-500 text-xs font-mono truncate max-w-40">{c.path}</span>
              <button
                onClick={() => deleteCategory(c.id)}
                className="text-zinc-600 hover:text-red-400 text-sm ml-2 transition-colors"
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-zinc-600 text-sm">Sin categorías.</p>
          )}
        </div>

        <form onSubmit={addCategory} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 space-y-3">
          <p className="text-zinc-300 text-sm font-medium">Nueva categoría</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 text-xs mb-1">Nombre</label>
              <input
                value={newCat.name}
                onChange={(e) => setNewCat((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                placeholder="Documentales"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs mb-1">Ruta</label>
              <input
                value={newCat.path}
                onChange={(e) => setNewCat((p) => ({ ...p, path: e.target.value }))}
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-1.5 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
                placeholder="/media/docs"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs mb-1">Tipo</label>
              <select
                value={newCat.type}
                onChange={(e) => setNewCat((p) => ({ ...p, type: e.target.value }))}
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {CATEGORY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 text-xs mb-1">Icono</label>
              <select
                value={newCat.icon}
                onChange={(e) => setNewCat((p) => ({ ...p, icon: e.target.value }))}
                className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              >
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          {catError && <p className="text-red-400 text-sm">{catError}</p>}
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-md transition-colors"
          >
            Añadir categoría
          </button>
        </form>
      </section>
    </main>
  );
}
