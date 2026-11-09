import { ExpandableText } from '@/components/ui/ExpandableText';
import { formatLongDate } from '@/lib/format';
import type { NewsItem } from '@/data/news';

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-ivory shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-ivory-deep px-6 text-center font-sans text-xs font-semibold uppercase tracking-wider text-graphite-soft">
            Imagen pendiente de incorporar
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-coral-soft px-3 py-1 font-sans text-xs font-semibold text-ink">
            {item.category}
          </span>
          <time dateTime={item.date} className="text-xs text-graphite-soft">
            {item.date ? formatLongDate(item.date) : 'Fecha no indicada'}
          </time>
        </div>
        <h3 className="font-sans text-lg leading-snug">{item.title}</h3>
        <p className="leading-relaxed text-graphite">{item.excerpt}</p>
        <div className="mt-auto flex flex-col gap-3 pt-2">
          <ExpandableText text={item.body} />
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-sans text-sm font-semibold text-ink underline decoration-coral decoration-2 underline-offset-4">
              Ver documento fuente
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
