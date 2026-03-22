'use client';

import { useEffect, useState } from 'react';
import MediaBrowser from '@/components/MediaBrowser';

export default function MediaPage() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/media')
      .then((r) => r.json())
      .then((data) => { setTree(data); setLoading(false); });
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Librería</h1>
      {loading ? (
        <p className="text-zinc-500 text-sm">Cargando...</p>
      ) : (
        <MediaBrowser tree={tree} />
      )}
    </main>
  );
}
