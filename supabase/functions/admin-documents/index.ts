import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function makeResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const JWT_SECRET = Deno.env.get("RUMBO_JWT_SECRET") ?? "rumbo-fallback-secret-change-me";

async function verifyToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) return false;
    return payload.role === "rumbo-admin" && payload.username === "rumbofuturoo";
  } catch {
    return false;
  }
}

function getAdminToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

// Split text into chunks of ~1000 characters at paragraph/sentence boundaries
function chunkText(text: string, maxChunkSize = 1000): string[] {
  const cleanText = text.replace(/\r\n/g, "\n").trim();
  if (cleanText.length === 0) return [];

  const paragraphs = cleanText.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (trimmed.length === 0) continue;

    if (current.length + trimmed.length + 2 > maxChunkSize) {
      if (current.length > 0) {
        chunks.push(current.trim());
        current = "";
      }
      if (trimmed.length > maxChunkSize) {
        const sentences = trimmed.split(/(?<=[.!?])\s+/);
        for (const sentence of sentences) {
          if (current.length + sentence.length + 1 > maxChunkSize) {
            if (current.length > 0) {
              chunks.push(current.trim());
              current = "";
            }
            if (sentence.length > maxChunkSize) {
              for (let i = 0; i < sentence.length; i += maxChunkSize) {
                chunks.push(sentence.slice(i, i + maxChunkSize).trim());
              }
            } else {
              current = sentence;
            }
          } else {
            current = current.length > 0 ? `${current} ${sentence}` : sentence;
          }
        }
      } else {
        current = trimmed;
      }
    } else {
      current = current.length > 0 ? `${current}\n\n${trimmed}` : trimmed;
    }
  }

  if (current.length > 0) {
    chunks.push(current.trim());
  }

  return chunks;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const token = getAdminToken(req.headers.get("Authorization"));
  if (!token || !(await verifyToken(token))) {
    return makeResponse({ error: "No autorizado" }, 401);
  }

  const url = new URL(req.url);

  // GET: list documents
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("rag_documents")
      .select("id, filename, file_type, status, error_message, chunk_count, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      return makeResponse({ error: "Error al obtener documentos" }, 500);
    }

    return makeResponse({ documents: data ?? [] });
  }

  // POST: upload a new document (multipart/form-data)
  if (req.method === "POST") {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return makeResponse({ error: "No se ha enviado ningún archivo" }, 400);
    }

    const filename = file.name;
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext !== "pdf" && ext !== "docx") {
      return makeResponse({ error: "Solo se admiten archivos PDF y DOCX" }, 400);
    }

    const fileType = ext as "pdf" | "docx";
    const fileId = crypto.randomUUID();
    const filePath = `${fileId}/${filename}`;

    // Upload to storage bucket
    const { error: uploadError } = await supabase.storage
      .from("rag-documents")
      .upload(filePath, file, { contentType: file.type });

    if (uploadError) {
      return makeResponse({ error: "Error al subir el archivo: " + uploadError.message }, 500);
    }

    // Create document record
    const { data: doc, error: docError } = await supabase
      .from("rag_documents")
      .insert({ filename, file_path: filePath, file_type: fileType, status: "processing" })
      .select("id, filename, file_type, status, error_message, chunk_count, created_at, updated_at")
      .single();

    if (docError) {
      return makeResponse({ error: "Error al registrar el documento" }, 500);
    }

    // Download and extract text
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("rag-documents")
      .download(filePath);

    if (downloadError || !fileData) {
      await supabase.from("rag_documents").update({ status: "error", error_message: "No se pudo descargar el archivo", updated_at: new Date().toISOString() }).eq("id", doc.id);
      return makeResponse({ error: "Error al procesar el archivo" }, 500);
    }

    let extractedText = "";
    try {
      if (fileType === "pdf") {
        // Parse PDF text: extract text from PDF content streams
        const bytes = new Uint8Array(await fileData.arrayBuffer());
        extractedText = await extractPdfText(bytes);
      } else {
        // DOCX: extract text from the XML inside the zip
        const bytes = new Uint8Array(await fileData.arrayBuffer());
        extractedText = await extractDocxText(bytes);
      }
    } catch (extractError) {
      const errMsg = extractError instanceof Error ? extractError.message : "Error desconocido";
      await supabase.from("rag_documents").update({ status: "error", error_message: errMsg, updated_at: new Date().toISOString() }).eq("id", doc.id);
      return makeResponse({ error: "Error al extraer texto del documento: " + errMsg }, 500);
    }

    if (extractedText.trim().length === 0) {
      await supabase.from("rag_documents").update({ status: "error", error_message: "No se pudo extraer texto del documento", updated_at: new Date().toISOString() }).eq("id", doc.id);
      return makeResponse({ error: "El documento no contiene texto extraíble" }, 400);
    }

    // Chunk the text
    const chunks = chunkText(extractedText);

    if (chunks.length === 0) {
      await supabase.from("rag_documents").update({ status: "error", error_message: "No se pudieron generar fragmentos", updated_at: new Date().toISOString() }).eq("id", doc.id);
      return makeResponse({ error: "No se pudieron generar fragmentos del documento" }, 400);
    }

    // Insert chunks
    const chunkRows = chunks.map((content, index) => ({
      document_id: doc.id,
      chunk_index: index,
      content,
    }));

    const { error: chunkError } = await supabase.from("rag_chunks").insert(chunkRows);
    if (chunkError) {
      await supabase.from("rag_documents").update({ status: "error", error_message: "Error al guardar fragmentos", updated_at: new Date().toISOString() }).eq("id", doc.id);
      return makeResponse({ error: "Error al guardar fragmentos" }, 500);
    }

    // Update document status
    const { data: updatedDoc, error: updateErr } = await supabase
      .from("rag_documents")
      .update({ status: "processed", chunk_count: chunks.length, updated_at: new Date().toISOString() })
      .eq("id", doc.id)
      .select("id, filename, file_type, status, error_message, chunk_count, created_at, updated_at")
      .single();

    if (updateErr) {
      return makeResponse({ error: "Error al actualizar el estado del documento" }, 500);
    }

    return makeResponse({ document: updatedDoc });
  }

  // DELETE: remove a document and its chunks
  if (req.method === "DELETE") {
    const docId = url.searchParams.get("id");
    if (!docId) {
      return makeResponse({ error: "ID de documento requerido" }, 400);
    }

    const { data: doc, error: docError } = await supabase
      .from("rag_documents")
      .select("file_path")
      .eq("id", docId)
      .maybeSingle();

    if (docError || !doc) {
      return makeResponse({ error: "Documento no encontrado" }, 404);
    }

    // Delete chunks (cascade will handle this, but explicit for safety)
    await supabase.from("rag_chunks").delete().eq("document_id", docId);

    // Delete document record
    const { error: deleteErr } = await supabase.from("rag_documents").delete().eq("id", docId);
    if (deleteErr) {
      return makeResponse({ error: "Error al eliminar el documento" }, 500);
    }

    // Delete file from storage
    if (doc.file_path) {
      await supabase.storage.from("rag-documents").remove([doc.file_path]);
    }

    return makeResponse({ success: true });
  }

  return makeResponse({ error: "Método no permitido" }, 405);
});

// --- PDF text extraction ---
// Extracts text from PDF by scanning content streams for text operators.
// This handles simple PDFs; complex PDFs with encoded fonts may produce partial results.
async function extractPdfText(bytes: Uint8Array): Promise<string> {
  const text = new TextDecoder("latin1").decode(bytes);
  const parts: string[] = [];

  // Match text in parentheses within BT/ET blocks (Tj and TJ operators)
  const btEtRegex = /BT\s([\s\S]*?)\sET/g;
  let btMatch;
  while ((btMatch = btEtRegex.exec(text)) !== null) {
    const block = btMatch[1];
    // Match (text) Tj or [(text) num (text)] TJ
    const tjRegex = /\(([^()]*)\)\s*Tj/g;
    let tjMatch;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      parts.push(unescapePdfString(tjMatch[1]));
    }
    const tjArrayRegex = /\(([^()]*)\)/g;
    let tjArrMatch;
    while ((tjArrMatch = tjArrayRegex.exec(block)) !== null) {
      // Only add if inside a TJ array context — to avoid double-counting
      if (block.substring(tjArrMatch.index + tjArrMatch[0].length).trim().startsWith("]") ||
          block.substring(0, tjArrMatch.index).trim().endsWith("[")) {
        parts.push(unescapePdfString(tjArrMatch[1]));
      }
    }
  }

  const result = parts.join(" ").replace(/\s+/g, " ").trim();
  if (result.length < 10) {
    throw new Error("No se pudo extraer texto suficiente del PDF. El archivo puede usar codificaciones especiales.");
  }
  return result;
}

function unescapePdfString(s: string): string {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

// --- DOCX text extraction ---
// DOCX is a ZIP archive; the text is in word/document.xml inside the zip.
// We use a minimal ZIP reader to extract the document.xml and parse <w:t> elements.
async function extractDocxText(bytes: Uint8Array): Promise<string> {
  // Use Deno's built-in decompression via CompressionStream
  // Actually, we need a ZIP reader. Let's use a minimal approach with jszip via npm.
  const { default: JSZip } = await import("npm:jszip@3.10.1");
  const zip = await JSZip.loadAsync(bytes);
  const docXml = zip.file("word/document.xml");
  if (!docXml) {
    throw new Error("No se encontró word/document.xml en el archivo DOCX");
  }
  const xmlContent = await docXml.async("string");
  // Extract text from <w:t> elements
  const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
  const parts: string[] = [];
  let match;
  while ((match = textRegex.exec(xmlContent)) !== null) {
    parts.push(decodeXmlEntities(match[1]));
  }
  // Add paragraph breaks
  const paraRegex = /<\/w:p>/g;
  let text = xmlContent;
  // Re-parse to add line breaks at paragraph ends
  const fullText = parts.join(" ");

  // Better approach: split by </w:p> and extract text from each paragraph
  const paragraphs = xmlContent.split(/<\/w:p>/);
  const paraTexts: string[] = [];
  for (const para of paragraphs) {
    const tParts: string[] = [];
    let tMatch;
    const tRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    while ((tMatch = tRegex.exec(para)) !== null) {
      tParts.push(decodeXmlEntities(tMatch[1]));
    }
    if (tParts.length > 0) {
      paraTexts.push(tParts.join(""));
    }
  }

  const result = paraTexts.join("\n\n").trim();
  if (result.length < 10) {
    throw new Error("No se pudo extraer texto suficiente del DOCX.");
  }
  return result;
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
