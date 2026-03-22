import path from 'path';
import type { Category } from './db';

export type OrganizeParams = {
  title: string;
  year: number | null;
  season: number | null;
  episode: number | null;
  ext: string;            // ".mkv", ".mp4", etc.
  category: Category;
};

/**
 * Genera la ruta de destino completa siguiendo las convenciones de Jellyfin.
 *
 * Películas:  {category.path}/Movie Name (2024)/Movie Name (2024).mkv
 * Series:     {category.path}/Show Name/Season 01/Show Name - S01E03.mkv
 * Anime:      {category.path}/Anime Name/Season 01/Anime Name - S01E03.mkv
 */
export function buildDestPath(params: OrganizeParams): string {
  const { title, year, season, episode, ext, category } = params;

  if (category.type === 'movie') {
    const folderName = year ? `${title} (${year})` : title;
    const fileName = `${folderName}${ext}`;
    return path.posix.join(category.path, folderName, fileName);
  }

  // series / anime
  const seasonNum = season ?? 1;
  const episodeNum = episode ?? 1;
  const seasonFolder = `Season ${String(seasonNum).padStart(2, '0')}`;
  const episodeTag = `S${String(seasonNum).padStart(2, '0')}E${String(episodeNum).padStart(2, '0')}`;
  const fileName = `${title} - ${episodeTag}${ext}`;

  return path.posix.join(category.path, title, seasonFolder, fileName);
}

/**
 * Devuelve solo la parte legible del destino para mostrar en la UI.
 */
export function buildDestPreview(params: OrganizeParams): string {
  const dest = buildDestPath(params);
  return dest;
}
