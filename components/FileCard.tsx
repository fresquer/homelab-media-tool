'use client';

import type { ParsedFile } from '@/lib/fileParser';

type FileInfo = {
  name: string;
  path: string;
  size: number;
  mtime: string;
  ext: string;
  parsed: ParsedFile;
};

type Props = {
  file: FileInfo;
  onOrganize: (file: FileInfo) => void;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export default function FileCard({ file, onOrganize }: Props) {
  const { parsed } = file;

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 flex items-center gap-4 hover:border-indigo-500 transition-colors">
      <div className="text-3xl select-none">{parsed.isSeries ? '📺' : '🎬'}</div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate" title={file.name}>{file.name}</p>
        <div className="flex gap-3 mt-1 text-xs text-zinc-400">
          <span>{formatBytes(file.size)}</span>
          <span>{file.ext.toUpperCase().replace('.', '')}</span>
          {parsed.isSeries && parsed.season !== null && (
            <span className="text-indigo-400">
              T{String(parsed.season).padStart(2, '0')}
              {parsed.episode !== null && `E${String(parsed.episode).padStart(2, '0')}`}
            </span>
          )}
          {parsed.year && <span>{parsed.year}</span>}
        </div>
        {parsed.title && (
          <p className="text-zinc-300 text-sm mt-0.5 truncate">{parsed.title}</p>
        )}
      </div>
      <button
        onClick={() => onOrganize(file)}
        className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-md transition-colors"
      >
        Organizar
      </button>
    </div>
  );
}
