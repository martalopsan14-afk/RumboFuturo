import { ARTICLES, type ArticleItem } from '@/data/articles';
import { DemoTag } from '@/components/ui/DemoTag';
import { ExpandableText } from '@/components/ui/ExpandableText';
import { SectionHeader } from '@/components/ui/SectionHeader';

function ArticleCard({ article }: { article: ArticleItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-ivory shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <span className="w-fit rounded-full bg-coral-soft px-3 py-1 font-sans text-xs font-semibold text-ink">
          {article.category}
        </span>
        <h3 className="font-sans text-lg leading-snug">{article.title}</h3>
        <dl className="grid gap-2 border-y border-ink/10 py-4 text-sm">
          <div>
            <dt className="font-sans text-xs font-semibold uppercase tracking-wider text-graphite-soft">Periodista</dt>
            <dd>{article.journalist}</dd>
          </div>
          <div>
            <dt className="font-sans text-xs font-semibold uppercase tracking-wider text-graphite-soft">
              Experto o investigador
            </dt>
            <dd>{article.expert}</dd>
          </div>
          <div>
            <dt className="font-sans text-xs font-semibold uppercase tracking-wider text-graphite-soft">Medio asociado</dt>
            <dd>{article.outlet}</dd>
          </div>
        </dl>
        <p className="leading-relaxed">{article.excerpt}</p>
        <div className="mt-auto pt-2">
          <ExpandableText text={article.body} collapsedLabel="Leer artículo" expandedLabel="Cerrar artículo" />
        </div>
      </div>
    </article>
  );
}

const PARTICIPATING_OUTLETS = [...new Set(ARTICLES.map((article) => article.outlet))];

export function ArticlesGallery() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-start gap-6">
        <SectionHeader
          title="El talento se demuestra contando historias"
          description="En Rumbo Futuro creemos que aprender periodismo también significa ponerlo en práctica. Por eso queremos impulsar artículos elaborados por periodistas emergentes con el acompañamiento de investigadores, expertos y profesionales de la comunicación."
        />
        <div className="flex flex-wrap items-center gap-3">
          <DemoTag />
          <ul className="flex flex-wrap gap-2" aria-label="Medios y entidades participantes">
            {PARTICIPATING_OUTLETS.map((outlet) => (
              <li
                key={outlet}
                className="rounded-full border border-ink/20 px-3 py-1 font-sans text-xs font-semibold text-ink"
              >
                {outlet}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.map((article) => (
          <li key={article.id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </div>
  );
}
