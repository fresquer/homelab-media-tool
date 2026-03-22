export type ParsedFile = {
  title: string;
  year: number | null;
  season: number | null;
  episode: number | null;
  isSeries: boolean;
};

/**
 * Limpia separadores del nombre (puntos, guiones bajos, guiones) y extrae
 * título, año, temporada y episodio del nombre de un archivo multimedia.
 */
export function parseFilename(filename: string): ParsedFile {
  // Quitar extensión
  const base = filename.replace(/\.[^.]+$/, '');

  // Detectar patrón de temporada+episodio: S01E03, s01e03, 1x03
  const seriesMatch =
    base.match(/[Ss](\d{1,2})[Ee](\d{1,2})/) ||
    base.match(/(\d{1,2})x(\d{2})/i);

  const season = seriesMatch ? parseInt(seriesMatch[1], 10) : null;
  const episode = seriesMatch ? parseInt(seriesMatch[2], 10) : null;
  const isSeries = seriesMatch !== null;

  // Extraer año (4 dígitos entre 1900-2099)
  const yearMatch = base.match(/\b(19\d{2}|20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : null;

  // Obtener la parte del título (todo lo que está antes del patrón de serie o año)
  let rawTitle = base;
  if (seriesMatch?.index !== undefined) {
    rawTitle = base.slice(0, seriesMatch.index);
  } else if (yearMatch?.index !== undefined) {
    rawTitle = base.slice(0, yearMatch.index);
  }

  const title = cleanTitle(rawTitle);

  return { title, year, season, episode, isSeries };
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/[._]/g, ' ')   // puntos y guiones bajos → espacio
    .replace(/-/g, ' ')      // guiones → espacio
    .replace(/\s+/g, ' ')    // espacios múltiples → uno
    .replace(/^\s+|\s+$/g, '') // trim
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Title Case
}
