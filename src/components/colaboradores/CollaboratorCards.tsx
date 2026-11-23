import type { CollaboratorItem } from '@/data/collaborators';

export function CollaboratorCards({ items }: { items: CollaboratorItem[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex h-full flex-col gap-6 rounded-[2rem] border border-ink/10 bg-ivory p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-ink/25 bg-ivory-deep/60 px-6">
            {item.logo ? (
              <img src={item.logo} alt={`Logotipo de ${item.name}`} loading="lazy" className="max-h-20 w-auto object-contain" />
            ) : (
              <span className="text-center font-sans text-sm font-semibold text-graphite-soft">
                Logotipo oficial pendiente
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-sans text-xl">{item.name}</h3>
            <p className="leading-relaxed text-graphite">{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
