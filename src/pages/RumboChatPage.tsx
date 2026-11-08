import { useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles, Check, X, Loader2, RotateCcw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getAgentRecommendation, type QuestionnaireAnswers, type RumboProfile, type AgentResponse } from '@/lib/rumbochat';

type Step = "profile" | "level" | "interests" | "format" | "loading" | "result";

const JOURNALIST_LEVELS = [
  "Estudiante de Periodismo",
  "Recién graduado/a en Periodismo",
  "Profesional de la comunicación",
  "Otro perfil relacionado con el periodismo",
];

const RESEARCHER_LEVELS = [
  "Investigador/a de la Facultad de Comunicación",
  "Investigador/a de otra área",
  "Profesional cualificado que busca colaboradores",
  "Otro perfil investigador o profesional",
];

const TOPIC_OPTIONS = [
  "Política",
  "Economía",
  "Deportes",
  "Moda",
  "Feminismo",
  "Cambio climático",
  "Políticas migratorias",
  "Cultura",
  "Sociedad",
  "Tecnología",
];

export function RumboChatPage() {
  const [step, setStep] = useState<Step>("profile");
  const [profile, setProfile] = useState<RumboProfile | null>(null);
  const [level, setLevel] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState<string>("");
  const [modality, setModality] = useState<"online" | "in_person" | "either">("either");
  const [duration, setDuration] = useState<"course" | "event" | "either">("either");
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string>("");

  const levels = profile === "journalist" ? JOURNALIST_LEVELS : RESEARCHER_LEVELS;

  const selectProfile = (p: RumboProfile) => {
    setProfile(p);
    setStep("level");
  };

  const toggleInterest = (topic: string) => {
    setInterests((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const allInterests = customTopic.trim()
    ? [...interests, customTopic.trim()]
    : interests;

  const canProceedInterests = allInterests.length > 0;

  const handleRecommendation = async () => {
    if (!profile) return;
    setStep("loading");
    setError("");

    const answers: QuestionnaireAnswers = {
      profile,
      level,
      interests: allInterests,
      format: { modality, duration },
    };

    try {
      const response = await getAgentRecommendation(answers);
      setResult(response);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar la recomendación");
      setStep("format");
    }
  };

  const reset = () => {
    setStep("profile");
    setProfile(null);
    setLevel("");
    setInterests([]);
    setCustomTopic("");
    setModality("either");
    setDuration("either");
    setResult(null);
    setError("");
  };

  const goBack = (from: Step) => {
    if (from === "level") setStep("profile");
    else if (from === "interests") setStep("level");
    else if (from === "format") setStep("interests");
  };

  const stepIndex = step === "profile" ? 0 : step === "level" ? 1 : step === "interests" ? 2 : step === "format" ? 3 : 4;
  const progressWidth = `${(stepIndex / 3) * 100}%`;

  return (
    <>
      <PageHeader
        eyebrow="RumboChat"
        title="Encuentra tu próximo rumbo profesional"
        description="¿No sabes qué especialidad periodística encaja contigo, qué formación elegir o con qué profesionales podrías colaborar? RumboChat te ayuda a encontrar la opción que mejor se adapta a tus intereses, tu perfil y tu disponibilidad."
      />

      <Section>
        <div className="mx-auto max-w-2xl">
          {/* Progress bar */}
          {step !== "loading" && step !== "result" && (
            <div className="mb-10">
              <div className="flex items-center justify-between font-sans text-xs font-semibold uppercase tracking-wider text-ink/60">
                <span>Paso {stepIndex} de 3</span>
                <span>{profile === "journalist" ? "Periodista emergente" : profile === "researcher" ? "Investigador o profesional" : "Selecciona perfil"}</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-coral transition-all duration-500" style={{ width: progressWidth }} />
              </div>
            </div>
          )}

          {/* Step 0: Profile selection */}
          {step === "profile" && (
            <div className="flex flex-col gap-8">
              <SectionHeader
                eyebrow="Comienza aquí"
                title="¿Cuál es tu perfil?"
                description="Selecciona el itinerario que mejor se adapta a tu situación."
              />
              <div className="flex flex-col gap-4 sm:flex-row">
                <ProfileCard
                  title="Soy periodista o talento emergente"
                  description="Quiero encontrar una especialización, un curso, una jornada o un tutor."
                  onClick={() => selectProfile("journalist")}
                />
                <ProfileCard
                  title="Soy investigador o profesional"
                  description="Quiero encontrar personas con las que colaborar en un proyecto o encuentro."
                  onClick={() => selectProfile("researcher")}
                />
              </div>
            </div>
          )}

          {/* Step 1: Level */}
          {step === "level" && (
            <div className="flex flex-col gap-8">
              <SectionHeader
                eyebrow="Pregunta 1"
                title="¿Cuál es tu nivel académico o profesional?"
              />
              <ul className="flex flex-col gap-3">
                {levels.map((lv) => (
                  <li key={lv}>
                    <button
                      type="button"
                      onClick={() => { setLevel(lv); setStep("interests"); }}
                      className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left font-sans text-base transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                        level === lv ? "border-ink bg-ink/5" : "border-ink/15 bg-ivory"
                      }`}
                    >
                      {lv}
                      <ArrowRight className="h-4 w-4 text-coral" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
              <BackButton onClick={() => goBack("level")} />
            </div>
          )}

          {/* Step 2: Interests */}
          {step === "interests" && (
            <div className="flex flex-col gap-8">
              <SectionHeader
                eyebrow="Pregunta 2"
                title="¿Qué temas te interesan?"
                description="Selecciona una o varias opciones. También puedes indicar una temática propia."
              />
              <div className="flex flex-wrap gap-3">
                {TOPIC_OPTIONS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleInterest(topic)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                      interests.includes(topic)
                        ? "border-ink bg-ink text-ivory"
                        : "border-ink/20 text-ink hover:border-ink"
                    }`}
                  >
                    {interests.includes(topic) && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    {topic}
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="custom-topic" className="mb-2 block font-sans text-sm font-semibold text-ink">
                  Otros temas
                </label>
                <input
                  id="custom-topic"
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Escribe tu temática de interés"
                  className="w-full rounded-full border border-ink/20 bg-white px-5 py-3 text-base text-graphite placeholder:text-graphite-soft/70 transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <BackButton onClick={() => goBack("interests")} />
                <button
                  type="button"
                  disabled={!canProceedInterests}
                  onClick={() => setStep("format")}
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-sans text-sm font-semibold text-ink transition duration-200 hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Format */}
          {step === "format" && (
            <div className="flex flex-col gap-8">
              <SectionHeader
                eyebrow="Pregunta 3"
                title="Preferencias de formato y disponibilidad"
                description="Indica tus preferencias para encontrar la mejor opción."
              />

              <div className="flex flex-col gap-6">
                <div>
                  <p className="mb-3 font-sans text-sm font-semibold text-ink">Modalidad preferida</p>
                  <div className="flex flex-wrap gap-3">
                    {([
                      { val: "online", label: "Online" },
                      { val: "in_person", label: "Presencial" },
                      { val: "either", label: "Indiferente" },
                    ] as const).map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setModality(opt.val)}
                        className={`rounded-full border px-4 py-2 font-sans text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                          modality === opt.val ? "border-ink bg-ink text-ivory" : "border-ink/20 text-ink hover:border-ink"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 font-sans text-sm font-semibold text-ink">
                    {profile === "journalist" ? "¿Prefieres un curso o un encuentro puntual?" : "¿Buscas una colaboración continua o puntual?"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {([
                      { val: "course", label: profile === "journalist" ? "Curso (suscripción)" : "Colaboración continua" },
                      { val: "event", label: profile === "journalist" ? "Encuentro puntual" : "Participación puntual" },
                      { val: "either", label: "Indiferente" },
                    ] as const).map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setDuration(opt.val)}
                        className={`rounded-full border px-4 py-2 font-sans text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
                          duration === opt.val ? "border-ink bg-ink text-ivory" : "border-ink/20 text-ink hover:border-ink"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm font-semibold text-ink" role="alert">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between gap-4">
                <BackButton onClick={() => goBack("format")} />
                <button
                  type="button"
                  onClick={handleRecommendation}
                  className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-sans text-sm font-semibold text-ink transition duration-200 hover:bg-ink hover:text-ivory"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Ver mi recomendación
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {step === "loading" && (
            <div className="flex flex-col items-center gap-6 py-20 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-coral" aria-hidden="true" />
              <p className="font-sans text-lg text-ink">Analizando tu perfil y consultando la base de conocimiento...</p>
            </div>
          )}

          {/* Result modal */}
          {step === "result" && result && (
            <ResultModal result={result} onReset={reset} />
          )}
        </div>
      </Section>
    </>
  );
}

function ProfileCard({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col gap-3 rounded-3xl border border-ink/15 bg-ivory p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
    >
      <h3 className="font-sans text-lg leading-snug text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-graphite">{description}</p>
      <span className="mt-2 inline-flex items-center gap-1 font-sans text-sm font-semibold text-coral">
        Seleccionar
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
              Creemos que eres el candidato perfecto para...
            </h2>
          </div>

          <div className="rounded-2xl bg-ink/5 p-6">
            <p className="font-sans text-lg font-bold text-ink leading-relaxed whitespace-pre-line">
              {result.recommendation}
            </p>
          </div>

          {result.justification && (
            <p className="leading-relaxed text-graphite">{result.justification}</p>
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
