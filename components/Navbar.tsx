'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/downloads', label: 'Descargas' },
  { href: '/media', label: 'Media' },
  { href: '/settings', label: 'Ajustes' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-zinc-900 border-b border-zinc-700 px-6 py-3 flex items-center gap-8">
      <span className="text-white font-bold text-lg tracking-tight">MediaTool</span>
      <div className="flex gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              pathname.startsWith(l.href)
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
