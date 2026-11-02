import { SectionHeader } from '@/components/ui/SectionHeader';

const DIFFERENTIATORS = [
  {
    title: 'Práctica frente a teoría exclusivamente',
    description: 'La formación está orientada a desarrollar competencias aplicables al trabajo periodístico.',
  },
  {
    title: 'Conexión profesional',
    description: 'Acercamos a los jóvenes a investigadores y profesionales de la comunicación.',
  },
  {
    title: 'Flexibilidad geográfica',
    description: 'La modalidad online permite participar desde diferentes lugares.',
  },
  {
    title: 'Accesibilidad económica',
    description: 'La suscripción busca facilitar el acceso a formación especializada a un precio competitivo.',
  },
];

export function DifferentiatorsGrid() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeader title="Qué nos diferencia" />
      <ul className="grid gap-6 sm:grid-cols-2">
        {DIFFERENTIATORS.map((item, index) => (
          <li
            key={item.title}
            className="flex gap-4 rounded-3xl border border-ink/10 bg-ivory p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:gap-6 sm:p-7"
          >
            <span className="font-sans text-3xl font-extrabold text-coral" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="font-sans text-lg">{item.title}</h3>
              <p className="leading-relaxed">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
