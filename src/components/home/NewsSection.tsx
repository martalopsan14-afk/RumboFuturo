import { DemoTag } from '@/components/ui/DemoTag';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NEWS_ITEMS } from '@/data/news';
import { NewsCard } from '@/components/home/NewsCard';

export function NewsSection() {
  return (
    <Section tone="deep">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Noticias"
            title="El periodismo que viene"
            description="Temas que marcan el presente y el futuro de la profesión para quienes empiezan a escribir su carrera."
          />
          <DemoTag />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {NEWS_ITEMS.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </Section>
  );
}
