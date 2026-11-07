export type RumboProfile = "journalist" | "researcher";

export interface QuestionnaireAnswers {
  profile: RumboProfile;
  level: string;
  interests: string[];
  format: {
    modality: "online" | "in_person" | "either";
    duration: "course" | "event" | "either";
  };
}

export interface AgentResponse {
  recommendation: string | null;
  justification?: string | null;
  cta?: string | null;
  ctaLink?: string | null;
  warning?: string | null;
  error?: string;
  details?: string;
  chunksUsed?: number[];
}

const FUNCTION_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export async function getAgentRecommendation(answers: QuestionnaireAnswers): Promise<AgentResponse> {
  const response = await fetch(`${FUNCTION_BASE}/rumbochat-agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ answers }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      recommendation: null,
      error: data.error ?? "Error al procesar la recomendación",
      details: data.details,
    };
  }

  return data as AgentResponse;
}
