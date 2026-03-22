import fs from 'fs';
import path from 'path';

/**
 * Copia un archivo de origen a destino, creando los directorios necesarios.
 * No elimina el archivo original.
 */
export async function copyFile(src: string, dest: string): Promise<void> {
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });
  await fs.promises.copyFile(src, dest);
}

/**
 * Lista archivos (no directorios) en una ruta dada.
 * Devuelve solo los archivos, sin recursión.
 */
export function listFiles(dir: string): FileInfo[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => {
      const filePath = path.join(dir, d.name);
      const stat = fs.statSync(filePath);
      return {
        name: d.name,
        path: filePath,
        size: stat.size,
        mtime: stat.mtime.toISOString(),
        ext: path.extname(d.name).toLowerCase(),
      };
    });
}

/**
 * Lista subdirectorios en una ruta dada (un nivel de profundidad).
 */
export function listDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export type FileInfo = {
  name: string;
  path: string;
  size: number;
  mtime: string;
  ext: string;
};

/** Extensiones multimedia reconocidas */
export const MEDIA_EXTENSIONS = new Set([
  '.mkv', '.mp4', '.avi', '.mov', '.wmv', '.m4v',
  '.ts', '.m2ts', '.flv', '.webm', '.ogv',
]);
