export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 p-8">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-4xl">📧</div>
        <h1 className="text-2xl font-bold text-slate-900">Verifique seu e-mail</h1>
        <p className="text-slate-600">
          Enviamos um link de acesso para o seu e-mail. Clique no link para entrar na plataforma.
        </p>
        <p className="text-sm text-slate-400">
          Não encontrou? Verifique sua pasta de spam.
        </p>
        <a href="/login" className="inline-block text-sm text-blue-600 hover:underline">
          Tentar com outro e-mail
        </a>
      </div>
    </main>
  );
}
