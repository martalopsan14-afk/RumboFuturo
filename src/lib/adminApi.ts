const FUNCTION_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export interface AdminLoginResult {
  token: string;
  mustChangePassword: boolean;
}

export async function adminLogin(username: string, password: string): Promise<AdminLoginResult> {
  const response = await fetch(`${FUNCTION_BASE}/admin-auth?action=login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Error de autenticación");
  }
  return { token: data.token, mustChangePassword: data.mustChangePassword };
}

export async function changeAdminPassword(token: string, newPassword: string): Promise<void> {
  const response = await fetch(`${FUNCTION_BASE}/admin-auth?action=change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Error al cambiar la contraseña");
  }
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const response = await fetch(`${FUNCTION_BASE}/admin-auth?action=verify`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.ok;
}

export interface SystemPromptData {
  systemPrompt: string;
  updatedAt: string;
}

export async function getSystemPrompt(token: string): Promise<SystemPromptData> {
  const response = await fetch(`${FUNCTION_BASE}/admin-prompt`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Error al obtener el system prompt");
  }
  return { systemPrompt: data.systemPrompt, updatedAt: data.updatedAt };
}

export async function updateSystemPrompt(token: string, systemPrompt: string): Promise<void> {
  const response = await fetch(`${FUNCTION_BASE}/admin-prompt`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ systemPrompt }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Error al guardar el system prompt");
  }
}

export interface RagDocument {
  id: string;
  filename: string;
  file_type: string;
  status: string;
  error_message: string | null;
  chunk_count: number;
  created_at: string;
  updated_at: string;
}

export async function listDocuments(token: string): Promise<RagDocument[]> {
  const response = await fetch(`${FUNCTION_BASE}/admin-documents`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Error al obtener documentos");
  }
  return data.documents as RagDocument[];
}

export async function uploadDocument(token: string, file: File): Promise<RagDocument> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${FUNCTION_BASE}/admin-documents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Error al subir el documento");
  }
  return data.document as RagDocument;
}

export async function deleteDocument(token: string, docId: string): Promise<void> {
  const response = await fetch(`${FUNCTION_BASE}/admin-documents?id=${docId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Error al eliminar el documento");
  }
}
