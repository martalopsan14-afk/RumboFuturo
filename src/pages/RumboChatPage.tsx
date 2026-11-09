className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-ink/60 transition hover:text-ink"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Atrás
    </button>
  );
}

function ResultModal({ result, onReset }: { result: AgentResponse; onReset: () => void }) {
  const hasError = !!result.error && !result.recommendation;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-ink/15 bg-ivory p-8 shadow-xl sm:p-10 animate-fade-up">
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-coral" />

      {hasError ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-coral/15">
              <X className="h-6 w-6 text-coral" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-sans text-xl text-ink">No se pudo generar la recomendación</h2>
              <p className="text-sm leading-relaxed text-graphite">{result.error}</p>
              {result.details && (
                <p className="text-xs text-graphite-soft">{result.details}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-coral">Resultado de RumboChat</p>
            <h2 className="font-editorial text-2xl italic leading-snug text-ink sm:text-3xl">
              Tu próxima oportunidad en Rumbo Futuro
            </h2>
          </div>

          <div className="rounded-2xl bg-ink/5 p-6">
            <p className="font-sans text-lg font-bold text-ink leading-relaxed whitespace-pre-line">
              {result.recommendation?.replace(/\*/g, "")}
            </p>
          </div>

          {result.justification && (
            <p className="leading-relaxed text-graphite">{result.justification.replace(/\*/g, "")}</p>
          )}

          {result.warning && (
            <p className="rounded-xl bg-ink/5 px-4 py-3 text-xs leading-relaxed text-graphite-soft" role="status">
              {result.warning}
            </p>
          )}

          {result.cta && (
            <div className="flex flex-wrap items-center gap-4">
              {result.ctaLink && (
                <a
                  href={result.ctaLink}
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-sans text-sm font-semibold text-ink transition duration-200 hover:bg-ink hover:text-ivory"
                >
                  {result.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
              {!result.ctaLink && (
                <p className="font-sans text-sm font-semibold text-ink">{result.cta}</p>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-ink/10 bg-coral-soft/40 p-5 leading-relaxed text-graphite">
            <p className="font-semibold text-ink">
              Gracias por completar el cuestionario de Rumbo Futuro.
            </p>
            <p className="mt-2">
              Esperamos que esta orientación te haya resultado útil. Si quieres ampliar la información, resolver dudas o recibir asesoramiento personalizado, estaremos encantados de ayudarte.
            </p>
            <p className="mt-3 font-semibold text-ink">
              ¿Quieres contactar con nuestro equipo?
            </p>
            <a
              href="mailto:Rumbofuturoo@gmail.com?subject=Consulta%20sobre%20Rumbo%20Futuro"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-coral px-5 py-3 font-sans text-sm font-semibold text-ink transition duration-200 hover:bg-ink hover:text-ivory"
            >
              Contactar por correo electrónico
            </a>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-4 border-t border-ink/10 pt-6">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 font-sans text-sm font-semibold text-ink transition hover:border-ink hover:bg-ink/5"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Volver a consultar
        </button>
      </div>
    </div>
  );
}
