import { BookOpen, Handshake, PenLine, type LucideIcon } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface Benefit {
  title: string;
  description: string;
  icon: LucideIcon;
}

const BENEFITS: Benefit[] = [
  {
    title: 'Aprende',
    description: 'Desarrolla competencias periodísticas mediante formación práctica.',
    icon: BookOpen,
  },
  {
    title: 'Conecta',
    description: 'Acércate a investigadores, expertos y profesionales de la comunicación.',
    icon: Handshake,
  },
  {
    title: 'Proyecta tu talento',
    description: 'Desarrolla trabajos que te ayuden a demostrar tus competencias y construir tu portfolio profesional.',
    icon: PenLine,
  },
];

export function BenefitsSection() {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <SectionHeader
          eyebrow="Nuestra propuesta de valor"
          title="El talento está ahí. Las oportunidades deben llegar."
          description="Muchos jóvenes periodistas terminan su formación sin disponer de experiencia suficiente, contactos profesionales u oportunidades para demostrar sus capacidades. Rumbo Futuro existe para cerrar esa distancia."
        />
        <ul className="grid gap-5 self-center">
          {BENEFITS.map(({ title, description, icon: Icon }) => (
            <li
              key={title}
              className="group flex gap-5 rounded-3xl border border-ink/10 bg-ivory p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-coral/60 hover:shadow-lg"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-soft transition group-hover:bg-coral">
                <Icon aria-hidden="true" className="h-7 w-7 text-ink" strokeWidth={1.75} />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-sans text-lg">{title}</h3>
                <p className="leading-relaxed text-graphite">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
