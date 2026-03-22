'use client';

type Season = string;
type TitleEntry = { title: string; seasons: Season[] };
type CategoryTree = {
  category: { id: number; name: string; path: string; type: string; icon: string };
  titles: TitleEntry[];
};

type Props = {
  tree: CategoryTree[];
};

const ICONS: Record<string, string> = {
  film: '🎬',
  tv: '📺',
  star: '⭐',
  folder: '📁',
};

export default function MediaBrowser({ tree }: Props) {
  if (tree.length === 0) {
    return <p className="text-zinc-500 text-sm">No hay categorías configuradas.</p>;
  }

  return (
    <div className="space-y-6">
      {tree.map(({ category, titles }) => (
        <div key={category.id}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{ICONS[category.icon] ?? '📁'}</span>
            <h2 className="text-white font-semibold text-lg">{category.name}</h2>
            <span className="text-zinc-500 text-sm">({titles.length})</span>
          </div>

          {titles.length === 0 ? (
            <p className="text-zinc-600 text-sm pl-8">Sin contenido todavía.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-8">
              {titles.map(({ title, seasons }) => (
                <div key={title} className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                  <p className="text-white text-sm font-medium truncate">{title}</p>
                  {seasons.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {seasons.map((s) => (
                        <span key={s} className="text-xs bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
