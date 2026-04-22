import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-2xl text-center space-y-6">
        <div className="text-5xl">🤖</div>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          Sua Jornada na IA
        </h1>
        <p className="text-xl text-slate-600">
          Descubra onde você está na jornada da inteligência artificial e receba
          um caminho de aprendizado personalizado, gerado por IA.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Começar agora →
          </a>
        </div>
        <p className="text-sm text-slate-400">Gratuito. Sem cartão de crédito.</p>
      </div>
    </main>
  );
}
