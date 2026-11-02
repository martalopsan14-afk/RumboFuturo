import { Button } from '@/components/ui/Button';
import { buildHref } from '@/data/navigation';

export function PortfolioCallout() {
  return (
    <div className="flex flex-col items-start gap-6 rounded-[2rem] bg-ink p-8 text-ivory sm:p-12 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex max-w-2xl flex-col gap-4">
        <h2 className="font-sans text-2xl sm:text-3xl">Aprende, practica y construye tu portfolio</h2>
        <p className="text-lg leading-relaxed text-ivory/85">
          Nuestra formación está pensada para que los conocimientos adquiridos puedan transformarse en experiencias
          prácticas y trabajos que ayuden a mostrar tu potencial periodístico.
        </p>
      </div>
      <Button href={buildHref('formacion-dual')} className="shrink-0">
        Descubre la formación
      </Button>
    </div>
  );
}
