export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          Sua Jornada na IA
        </h1>
        <p className="text-xl text-slate-600">
          Descubra onde você está na jornada da inteligência artificial e receba
          um caminho de aprendizado personalizado.
        </p>
        <a
          href="/onboarding"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Começar agora
        </a>
      </div>
    </main>
  );
}
