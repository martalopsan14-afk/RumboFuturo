import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import {
  Lock,
  LogOut,
  Save,
  Upload,
  Trash2,
  FileText,
  Loader2,
  Check,
  AlertCircle,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Settings,
  FolderOpen,
  FlaskConical,
} from 'lucide-react';
import {
  adminLogin,
  changeAdminPassword,
  verifyAdminToken,
  getSystemPrompt,
  updateSystemPrompt,
  listDocuments,
  uploadDocument,
  deleteDocument,
  type RagDocument,
} from '@/lib/adminApi';
import { getAgentRecommendation, type QuestionnaireAnswers, type AgentResponse } from '@/lib/rumbochat';

const TOKEN_KEY = 'rumbo_admin_token';

type AdminView = 'login' | 'changePassword' | 'dashboard';
type DashboardTab = 'prompt' | 'documents' | 'testing';

export function AdminPage() {
  const [view, setView] = useState<AdminView>('login');
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('prompt');

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (stored) {
      verifyAdminToken(stored).then((valid) => {
        if (valid) {
          setToken(stored);
          setView('dashboard');
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
        }
      });
    }
  }, []);

  const handleLogin = (newToken: string, mustChange: boolean) => {
    setToken(newToken);
    sessionStorage.setItem(TOKEN_KEY, newToken);
    setView(mustChange ? 'changePassword' : 'dashboard');
  };

  const handlePasswordChanged = () => {
    setView('dashboard');
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem(TOKEN_KEY);
    setView('login');
  };

  if (view === 'login') {
    return <LoginView onLogin={handleLogin} />;
  }

  if (view === 'changePassword') {
    return <ChangePasswordView token={token!} onDone={handlePasswordChanged} />;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="border-b border-ink/10 bg-ink text-ivory">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-coral" aria-hidden="true" />
            <h1 className="font-sans text-lg font-semibold">Panel de administración</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-ivory/25 px-4 py-2 font-sans text-sm font-semibold transition hover:bg-ivory/10"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex gap-2 border-b border-ink/10">
          <TabButton active={activeTab === 'prompt'} onClick={() => setActiveTab('prompt')} icon={Settings}>
            Instrucciones del agente
          </TabButton>
          <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon={FolderOpen}>
            Documentos y conocimiento
          </TabButton>
          <TabButton active={activeTab === 'testing'} onClick={() => setActiveTab('testing')} icon={FlaskConical}>
            Pruebas del agente
          </TabButton>
        </div>

        {activeTab === 'prompt' && <PromptEditorView token={token!} />}
        {activeTab === 'documents' && <DocumentsView token={token!} />}
        {activeTab === 'testing' && <TestingView token={token!} />}
      </div>
    </div>
  );
}

// ============================================================
// Login View
// ============================================================
function LoginView({ onLogin }: { onLogin: (token: string, mustChange: boolean) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await adminLogin(username, password);
      onLogin(result.token, result.mustChangePassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-md rounded-[2rem] bg-ivory p-8 shadow-2xl sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral/15">
            <Lock className="h-7 w-7 text-coral" aria-hidden="true" />
          </div>
          <h1 className="font-sans text-2xl font-bold text-ink">Panel de administración</h1>
          <p className="text-sm text-graphite">Acceso restringido al equipo de Rumbo Futuro</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="admin-user" className="mb-2 block font-sans text-sm font-semibold text-ink">
              Usuario
            </label>
            <input
              id="admin-user"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-base text-graphite transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>
          <div>
            <label htmlFor="admin-pass" className="mb-2 block font-sans text-sm font-semibold text-ink">
              Contraseña
            </label>
            <input
              id="admin-pass"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-base text-graphite transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm font-semibold text-ink" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-6 py-3 font-sans text-sm font-semibold text-ink transition duration-200 hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
            {loading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Change Password View
// ============================================================
function ChangePasswordView({ token, onDone }: { token: string; onDone: () => void }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await changeAdminPassword(token, newPassword);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-md rounded-[2rem] bg-ivory p-8 shadow-2xl sm:p-10">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral/15">
            <Lock className="h-7 w-7 text-coral" aria-hidden="true" />
          </div>
          <h1 className="font-sans text-2xl font-bold text-ink">Cambia tu contraseña</h1>
          <p className="text-sm text-graphite">Es necesario cambiar la contraseña provisional en el primer acceso.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="new-pass" className="mb-2 block font-sans text-sm font-semibold text-ink">
              Nueva contraseña
            </label>
            <input
              id="new-pass"
              type="password"
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-base text-graphite transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>
          <div>
            <label htmlFor="confirm-pass" className="mb-2 block font-sans text-sm font-semibold text-ink">
              Confirmar contraseña
            </label>
            <input
              id="confirm-pass"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-base text-graphite transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm font-semibold text-ink" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-coral px-6 py-3 font-sans text-sm font-semibold text-ink transition duration-200 hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
            {loading ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Tab Button
// ============================================================
function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 font-sans text-sm font-semibold transition ${
        active ? 'border-coral text-ink' : 'border-transparent text-ink/50 hover:text-ink'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

// ============================================================
// Prompt Editor View
// ============================================================
function PromptEditorView({ token }: { token: string }) {
  const [prompt, setPrompt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadPrompt = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSystemPrompt(token);
      setPrompt(data.systemPrompt);
      setUpdatedAt(data.updatedAt);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al cargar el system prompt' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPrompt();
  }, [loadPrompt]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateSystemPrompt(token, prompt);
      setMessage({ type: 'success', text: 'El system prompt se ha guardado y se aplicará en las próximas consultas de RumboChat.' });
      await loadPrompt();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-coral" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans text-xl font-bold text-ink">System prompt del agente</h2>
        <p className="text-sm text-graphite">
          Estas instrucciones se utilizan en cada consulta de RumboChat. Edita el texto y guárdalo para aplicarlo al agente real.
          {updatedAt && (
            <span className="mt-1 block text-xs text-graphite-soft">Última actualización: {new Date(updatedAt).toLocaleString('es-ES')}</span>
          )}
        </p>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={24}
        className="w-full rounded-2xl border border-ink/20 bg-white p-5 font-mono text-sm leading-relaxed text-graphite transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral"
        spellCheck={false}
      />

      {message && (
        <div className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm ${message.type === 'success' ? 'bg-ink/5 text-ink' : 'bg-coral/10 text-ink'}`}>
          {message.type === 'success' ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />}
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || prompt.trim().length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-sans text-sm font-semibold text-ink transition duration-200 hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {saving ? 'Guardando...' : 'Guardar y aplicar'}
        </button>
        <button
          type="button"
          onClick={loadPrompt}
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 font-sans text-sm font-semibold text-ink transition hover:border-ink hover:bg-ink/5"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Recuperar versión activa
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Documents View
// ============================================================
function DocumentsView({ token }: { token: string }) {
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDocs = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await listDocuments(token);
      setDocuments(docs);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al cargar documentos' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDocs();
  }, [loadDocs]);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    try {
      await uploadDocument(token, file);
      setMessage({ type: 'success', text: `"${file.name}" se ha procesado correctamente.` });
      await loadDocs();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al subir el documento' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (docId: string, filename: string) => {
    setDeletingId(docId);
    setMessage(null);
    try {
      await deleteDocument(token, docId);
      setMessage({ type: 'success', text: `"${filename}" se ha eliminado.` });
      await loadDocs();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error al eliminar' });
    } finally {
      setDeletingId(null);
    }
  };

  const statusLabel: Record<string, { text: string; color: string }> = {
    pending: { text: 'Pendiente', color: 'text-graphite-soft' },
    processing: { text: 'Procesando', color: 'text-ink' },
    processed: { text: 'Procesado', color: 'text-ink' },
    error: { text: 'Error', color: 'text-coral' },
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans text-xl font-bold text-ink">Documentos y base de conocimiento</h2>
        <p className="text-sm text-graphite">Sube archivos PDF o DOCX para incorporarlos al sistema RAG del agente.</p>
      </div>

      <div className="flex items-center gap-4">
        <label
          className={`inline-flex cursor-pointer items-center gap-2 rounded-full bg-coral px-6 py-3 font-sans text-sm font-semibold text-ink transition duration-200 hover:bg-ink hover:text-ivory ${uploading ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
          {uploading ? 'Subiendo...' : 'Subir documento'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            disabled={uploading}
            onChange={handleFileSelect}
            className="sr-only"
          />
        </label>
        <button
          type="button"
          onClick={loadDocs}
          className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 font-sans text-sm font-semibold text-ink transition hover:border-ink hover:bg-ink/5"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Actualizar lista
        </button>
      </div>

      {message && (
        <div className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm ${message.type === 'success' ? 'bg-ink/5 text-ink' : 'bg-coral/10 text-ink'}`}>
          {message.type === 'success' ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-coral" aria-hidden="true" />
        </div>
      ) : documents.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/20 py-16 text-center">
          <FileText className="h-10 w-10 text-ink/30" aria-hidden="true" />
          <p className="font-sans text-sm font-semibold text-ink">No hay documentos en la base de conocimiento</p>
          <p className="text-xs text-graphite-soft">Sube un archivo PDF o DOCX para empezar a construir el conocimiento del agente.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {documents.map((doc) => {
            const status = statusLabel[doc.status] ?? statusLabel.pending;
            return (
              <li key={doc.id} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-ivory p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink/5">
                    <FileText className="h-5 w-5 text-ink" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-sans text-sm font-semibold text-ink">{doc.filename}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-graphite-soft">
                      <span className="uppercase">{doc.file_type}</span>
                      <span className={status.color}>{status.text}</span>
                      <span>{doc.chunk_count} fragmentos</span>
                      <span>{new Date(doc.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                    {doc.error_message && (
                      <p className="mt-1 text-xs text-coral">{doc.error_message}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id, doc.filename)}
                  disabled={deletingId === doc.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-2 font-sans text-xs font-semibold text-ink/60 transition hover:border-coral hover:text-coral disabled:opacity-60"
                >
                  {deletingId === doc.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
                  Eliminar
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ============================================================
// Testing View
// ============================================================
function TestingView({ token: _token }: { token: string }) {
  const [profile, setProfile] = useState<'journalist' | 'researcher'>('journalist');
  const [level, setLevel] = useState('');
  const [interests, setInterests] = useState('');
  const [modality, setModality] = useState<'online' | 'in_person' | 'either'>('either');
  const [duration, setDuration] = useState<'course' | 'event' | 'either'>('either');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [error, setError] = useState('');

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    const interestList = interests
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (!level || interestList.length === 0) {
      setError('Completa el nivel y al menos un interés.');
      setLoading(false);
      return;
    }

    const answers: QuestionnaireAnswers = {
      profile,
      level,
      interests: interestList,
      format: { modality, duration },
    };

    try {
      const response = await getAgentRecommendation(answers);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la prueba');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-sans text-xl font-bold text-ink">Pruebas del agente</h2>
        <p className="text-sm text-graphite">Esta sección utiliza el mismo agente, system prompt y base de conocimiento que la aplicación pública de RumboChat.</p>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-ivory p-6">
        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-2 font-sans text-sm font-semibold text-ink">Perfil</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setProfile('journalist')}
                className={`rounded-full border px-4 py-2 font-sans text-sm font-semibold transition ${profile === 'journalist' ? 'border-ink bg-ink text-ivory' : 'border-ink/20 text-ink hover:border-ink'}`}
              >
                Periodista emergente
              </button>
              <button
                type="button"
                onClick={() => setProfile('researcher')}
                className={`rounded-full border px-4 py-2 font-sans text-sm font-semibold transition ${profile === 'researcher' ? 'border-ink bg-ink text-ivory' : 'border-ink/20 text-ink hover:border-ink'}`}
              >
                Investigador
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="test-level" className="mb-2 block font-sans text-sm font-semibold text-ink">Nivel académico o profesional</label>
            <input
              id="test-level"
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Ej: Estudiante de Periodismo"
              className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-base text-graphite transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>

          <div>
            <label htmlFor="test-interests" className="mb-2 block font-sans text-sm font-semibold text-ink">Intereses (separados por comas)</label>
            <input
              id="test-interests"
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Ej: Política, Economía, Cultura"
              className="w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-base text-graphite transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-coral"
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="mb-2 font-sans text-sm font-semibold text-ink">Modalidad</p>
              <div className="flex gap-2">
                {(['online', 'in_person', 'either'] as const).map((m) => (
                  <button key={m} type="button" onClick={() => setModality(m)}
                    className={`rounded-full border px-3 py-1.5 font-sans text-xs font-semibold transition ${modality === m ? 'border-ink bg-ink text-ivory' : 'border-ink/20 text-ink'}`}
                  >
                    {m === 'online' ? 'Online' : m === 'in_person' ? 'Presencial' : 'Indiferente'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-sans text-sm font-semibold text-ink">Duración</p>
              <div className="flex gap-2">
                {(['course', 'event', 'either'] as const).map((d) => (
                  <button key={d} type="button" onClick={() => setDuration(d)}
                    className={`rounded-full border px-3 py-1.5 font-sans text-xs font-semibold transition ${duration === d ? 'border-ink bg-ink text-ivory' : 'border-ink/20 text-ink'}`}
                  >
                    {d === 'course' ? 'Curso' : d === 'event' ? 'Encuentro' : 'Indiferente'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm font-semibold text-ink" role="alert">{error}</p>
          )}

          <button
            type="button"
            onClick={handleTest}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-sans text-sm font-semibold text-ink transition duration-200 hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
            {loading ? 'Procesando...' : 'Probar recomendación'}
          </button>
        </div>
      </div>

      {result && (
        <div className="rounded-2xl border border-ink/15 bg-ivory p-6 shadow-sm">
          <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-wider text-coral">Resultado de la prueba</p>
          {result.error && !result.recommendation ? (
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-coral" aria-hidden="true" />
              <div>
                <p className="font-sans text-sm font-semibold text-ink">{result.error}</p>
                {result.details && <p className="mt-1 text-xs text-graphite-soft">{result.details}</p>}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="font-editorial text-xl italic text-ink">Creemos que eres el candidato perfecto para...</p>
              <p className="font-sans text-base font-bold text-ink whitespace-pre-line">{result.recommendation}</p>
              {result.justification && <p className="text-sm text-graphite">{result.justification}</p>}
              {result.cta && <p className="font-sans text-sm font-semibold text-ink">{result.cta}</p>}
              {result.warning && (
                <p className="mt-2 rounded-xl bg-ink/5 px-4 py-2 text-xs text-graphite-soft">{result.warning}</p>
              )}
              {result.chunksUsed && result.chunksUsed.length > 0 && (
                <p className="mt-2 text-xs text-graphite-soft">Fragmentos recuperados: {result.chunksUsed.length}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
