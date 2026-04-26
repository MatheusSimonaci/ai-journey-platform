import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const STAGES = [
  {
    name: "Consciente",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    dot: "bg-purple-500",
    description: "Sabe que IA é importante, mas ainda não teve contato direto.",
  },
  {
    name: "Explorando",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    dot: "bg-blue-500",
    description: "Já experimentou ferramentas como ChatGPT e está construindo uma base.",
  },
  {
    name: "Aplicando",
    color: "bg-green-50 border-green-200 text-green-800",
    dot: "bg-green-500",
    description: "Usa IA regularmente no trabalho e quer ir mais fundo.",
  },
  {
    name: "Construindo",
    color: "bg-orange-50 border-orange-200 text-orange-800",
    dot: "bg-orange-500",
    description: "Está integrando ou criando produtos com IA.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Responda 5 perguntas",
    description:
      "Um questionário rápido (menos de 3 minutos) mapeia seu nível, objetivos e contexto.",
  },
  {
    step: "02",
    title: "IA gera seu caminho",
    description:
      "Claude analisa seu perfil e monta uma trilha de aprendizado personalizada com os melhores recursos.",
  },
  {
    step: "03",
    title: "Aprenda e avance",
    description:
      "Acesse recursos curados, marque o que concluiu e atualize seu caminho conforme evolui.",
  },
];

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <span className="font-semibold text-slate-900">Jornada IA</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Começar grátis
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
          Caminho personalizado gerado por IA
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
          Descubra onde você está{" "}
          <span className="text-blue-600">na jornada da IA</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Responda 5 perguntas e receba um roteiro de aprendizado personalizado, gerado por IA, exatamente no seu nível — seja você iniciante ou desenvolvedor construindo produtos com IA.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
          >
            Descobrir meu caminho →
          </Link>
        </div>
        <p className="text-sm text-slate-400">
          Gratuito. Sem cartão de crédito. Leva menos de 3 minutos.
        </p>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-14">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">Como funciona</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Em menos de 3 minutos você já tem um caminho de aprendizado personalizado para o seu perfil.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm space-y-4"
              >
                <span className="text-4xl font-bold text-slate-200">{item.step}</span>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Stages */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-14">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">Qual é o seu estágio?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Todo mundo começa em algum lugar. A plataforma identifica onde você está e constrói o caminho ideal a partir daí.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGES.map((stage) => (
              <div
                key={stage.name}
                className={`rounded-2xl border p-6 space-y-3 ${stage.color}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.dot}`} />
                  <span className="font-semibold text-sm">{stage.name}</span>
                </div>
                <p className="text-sm leading-relaxed opacity-80">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-6 space-y-14">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">Por que usar a Jornada IA?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Totalmente personalizado",
                description:
                  "Nenhuma trilha genérica. A IA monta um caminho único com base no seu nível, objetivo e estilo de aprendizado.",
              },
              {
                icon: "⚡",
                title: "Gerado em segundos",
                description:
                  "Claude analisa seu perfil e seleciona os melhores recursos entre dezenas de opções curadas — instantaneamente.",
              },
              {
                icon: "📊",
                title: "Acompanhe seu progresso",
                description:
                  "Marque recursos como concluídos, veja seu avanço e atualize seu caminho conforme seu perfil evolui.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm space-y-4"
              >
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl font-bold text-slate-900">
            Pronto para trilhar sua jornada?
          </h2>
          <p className="text-lg text-slate-500">
            Gratuito, sem complicação. Descubra seu estágio e comece a aprender do jeito certo.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
          >
            Começar agora →
          </Link>
          <p className="text-sm text-slate-400">Gratuito. Sem cartão de crédito.</p>
        </div>
      </section>
    </div>
  );
}
