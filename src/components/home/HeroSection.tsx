import { Button } from '@/components/ui/Button';
import { buildHref } from '@/data/navigation';

const HERO_IMAGE_URL = '/Logo_normal.jpeg';

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ivory">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-28 lg:pt-28">
        <div className="flex flex-col gap-7 animate-fade-up">
          <p className="font-editorial text-2xl italic text-coral sm:text-3xl">Tu talento, tu puerta al mundo</p>
          <h1 className="font-sans text-4xl leading-[1.1] text-ivory sm:text-5xl lg:text-6xl">
            El futuro del periodismo empieza con tu oportunidad
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-ivory/85">
            Conectamos a periodistas emergentes con investigadores, expertos y profesionales de la comunicación para
            que desarrollen sus competencias, ganen experiencia práctica y encuentren nuevas oportunidades en el mundo
            laboral.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href={buildHref('nuestro-rumbo')}>Descubre nuestro rumbo</Button>
            <Button
              variant="outline"
              href={buildHref('formacion-dual')}
              className="border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/10"
            >
              Explora la formación
            </Button>
          </div>
        </div>

        <div className="relative flex flex-col gap-5 animate-fade-up [animation-delay:150ms]">
          <div aria-hidden="true" className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] border-2 border-coral sm:-right-6 sm:-top-6" />
          <img
            src={HERO_IMAGE_URL}
            alt="Rumbo Futuro"
            width={940}
            height={650}
            className="relative aspect-[4/5] w-full rounded-[2rem] bg-ink object-contain shadow-2xl sm:aspect-[5/4]"
          />
        </div>
      </div>
    </section>
  );
}
