"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const QUESTIONS = [
  {
    id: "experience",
    title: "Como você descreveria sua experiência com IA hoje?",
    options: [
      { value: "aware", label: "Já ouvi falar, mas nunca usei" },
      { value: "exploring", label: "Já experimentei ferramentas como ChatGPT" },
      { value: "applying", label: "Uso IA regularmente no meu trabalho" },
      { value: "building", label: "Estou construindo produtos ou integrações com IA" },
    ],
  },
  {
    id: "goal",
    title: "Qual é seu principal objetivo com IA?",
    options: [
      { value: "stay_informed", label: "Me manter atualizado" },
      { value: "apply_to_work", label: "Aplicar no meu trabalho" },
      { value: "build_products", label: "Construir produtos" },
      { value: "research", label: "Pesquisa e desenvolvimento" },
    ],
  },
  {
    id: "domain",
    title: "Em qual área você atua?",
    options: [
      { value: "tech", label: "Tecnologia" },
      { value: "business", label: "Negócios/Gestão" },
      { value: "creative", label: "Criativo/Design" },
      { value: "healthcare", label: "Saúde" },
      { value: "education", label: "Educação" },
      { value: "legal", label: "Jurídico" },
      { value: "other", label: "Outro" },
    ],
  },
  {
    id: "timeAvailable",
    title: "Quanto tempo por semana você pode dedicar ao aprendizado de IA?",
    options: [
      { value: "under_1h", label: "Menos de 1h" },
      { value: "1_3h", label: "1-3 horas" },
      { value: "3_5h", label: "3-5 horas" },
      { value: "over_5h", label: "Mais de 5 horas" },
    ],
  },
  {
    id: "learningStyle",
    title: "Como você prefere aprender?",
    options: [
      { value: "reading", label: "Lendo artigos" },
      { value: "video", label: "Assistindo vídeos" },
      { value: "hands_on", label: "Praticando / mão na massa" },
      { value: "mixed", label: "Combinação de tudo" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  function selectOption(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  async function handleNext() {
    if (!answers[question.id]) return;
    if (isLast) {
      await submit();
    } else {
      setStep((s) => s + 1);
    }
  }

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience: answers.experience,
          goal: answers.goal,
          domain: answers.domain,
          timeAvailable: answers.timeAvailable,
          learningStyle: answers.learningStyle,
        }),
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const err = await res.json() as { error?: string };
        alert(err.error ?? "Erro ao processar. Tente novamente.");
        setLoading(false);
      }
    } catch {
      alert("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 p-8">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-pulse">🤖</div>
          <h2 className="text-xl font-semibold text-slate-800">
            Gerando seu caminho personalizado...
          </h2>
          <p className="text-slate-500">
            A IA está analisando seu perfil e selecionando os melhores recursos para você.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Pergunta {step + 1} de {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">{question.title}</h2>
          <div className="space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => selectOption(opt.value)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  answers[question.id] === opt.value
                    ? "border-blue-600 bg-blue-50 text-blue-900"
                    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Voltar
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!answers[question.id]}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLast ? "Ver meu caminho →" : "Próxima →"}
          </button>
        </div>
      </div>
    </main>
  );
}
