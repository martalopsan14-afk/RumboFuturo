import { BookOpen, Globe, Tag, Users } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const PROPOSAL_IDEAS = [
  { label: 'Formación práctica', icon: BookOpen },
  { label: 'Flexibilidad geográfica', icon: Globe },
  { label: 'Conexión con investigadores y expertos', icon: Users },
  { label: 'Precio competitivo', icon: Tag },
];

export function PurposeBlocks() {
  return (
    <div className="flex flex-col gap-16">
      <SectionHeader
        eyebrow="Nuestra esencia"
        title="Un puente entre el talento periodístico y el mundo laboral"
      />

      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <article className="flex flex-col gap-5 border-t-2 border-ink pt-6">
          <h3 className="font-sans text-xl">Nuestro propósito</h3>
          <p className="font-editorial text-2xl italic leading-snug text-ink">«¿Y ahora qué?»</p>
          <p className="leading-relaxed">
            Rumbo Futuro nace para responder a una pregunta que se hacen muchos jóvenes cuando terminan sus estudios de
            Periodismo.
          </p>
          <p className="leading-relaxed">
            Queremos facilitar su transición desde la formación académica hacia el mundo profesional, creando
            oportunidades para aprender de investigadores y expertos, adquirir experiencia práctica y demostrar sus
            capacidades. Nuestro propósito es contribuir a que el talento periodístico emergente encuentre oportunidades
            para crecer y desarrollar su carrera.
          </p>
        </article>

        <article className="flex flex-col gap-5 border-t-2 border-ink pt-6">
          <h3 className="font-sans text-xl">El problema que queremos solucionar</h3>
          <p className="leading-relaxed">
            Muchos jóvenes periodistas encuentran dificultades para acceder a su primer empleo, conseguir experiencia
            práctica y establecer contactos profesionales.
          </p>
          <p className="leading-relaxed">
            Además, el coste de determinados cursos y las barreras geográficas pueden limitar el acceso a oportunidades
            formativas. Rumbo Futuro pretende responder a estas necesidades mediante una formación accesible, flexible y
            conectada con la realidad profesional.
          </p>
        </article>
      </div>

      <article className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-ivory sm:p-12">
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-coral" />
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.2em] text-coral">
              Nuestra propuesta de valor
            </h3>
            <p className="max-w-4xl font-editorial text-2xl italic leading-snug text-ivory sm:text-3xl">
              Ofrecemos una formación práctica y flexible geográficamente que conecta a los periodistas emergentes con el
              mundo laboral a través de los investigadores, a un precio competitivo.
            </p>
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-ivory/85">
            Nuestra propuesta combina aprendizaje práctico, flexibilidad geográfica y conexión con el entorno profesional.
            Queremos que los jóvenes periodistas puedan desarrollar sus competencias, aprender junto a expertos y acercarse
            al mundo laboral sin que la distancia o el coste de la formación se conviertan en barreras innecesarias.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROPOSAL_IDEAS.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex flex-col gap-4 rounded-2xl border border-ivory/15 bg-ivory/5 p-5 transition duration-300 hover:border-coral hover:bg-ivory/10"
              >
                <Icon aria-hidden="true" className="h-6 w-6 text-coral" strokeWidth={1.75} />
                <span className="font-sans text-sm font-semibold leading-snug text-ivory">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
