import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an AI learning path advisor. Your job is to analyze a user's AI learning profile and return a structured JSON response.

Journey stages:
- "aware": Knows AI is important but has no hands-on experience. Focus on fundamentals and accessible overviews.
- "exploring": Has tried ChatGPT or similar tools. Building mental models. Focus on practical applications and key concepts.
- "applying": Uses AI regularly at work. Wants to go deeper. Focus on advanced techniques and domain-specific use.
- "building": Technical user integrating or building AI-powered products. Focus on APIs, models, fine-tuning, and architecture.

Given the user's onboarding answers, you MUST respond with ONLY valid JSON in this exact format:
{
  "stage": "aware|exploring|applying|building",
  "summary": "A 2-3 sentence personalized summary in Portuguese of where the user is in their AI journey and what they should focus on.",
  "resourceIds": ["id1", "id2", "id3", ...]
}

The resourceIds should be 8-12 resource IDs from the provided resource list, ordered by recommendation priority for this user's stage and goals.`;

const STAGE_ORDER = ["aware", "exploring", "applying", "building"] as const;

const GOAL_TAG_HINTS: Record<OnboardingAnswers["goal"], string[]> = {
  stay_informed: ["fundamentals", "broad", "reading-list", "trends", "news", "strategy"],
  apply_to_work: ["practical", "productivity", "tool", "domain", "management", "prompting"],
  build_products: ["coding", "API", "architecture", "LLM", "RAG", "tool use", "systems-design"],
  research: ["research", "academic", "papers", "MLOps", "eval", "observability"],
};

const STYLE_TYPE_PREFERENCES: Record<OnboardingAnswers["learningStyle"], string[]> = {
  reading: ["article", "book"],
  video: ["video"],
  hands_on: ["course", "tool"],
  mixed: [],
};

const TIME_TYPE_PREFERENCES: Record<OnboardingAnswers["timeAvailable"], string[]> = {
  under_1h: ["article", "tool", "video"],
  "1_3h": ["article", "video", "course"],
  "3_5h": ["course", "article", "video"],
  over_5h: ["course", "book", "article"],
};

export type OnboardingAnswers = {
  experience: "aware" | "exploring" | "applying" | "building";
  goal: "stay_informed" | "apply_to_work" | "build_products" | "research";
  domain: "tech" | "business" | "creative" | "healthcare" | "education" | "legal" | "other";
  timeAvailable: "under_1h" | "1_3h" | "3_5h" | "over_5h";
  learningStyle: "reading" | "video" | "hands_on" | "mixed";
};

export type PathGenerationResult = {
  stage: string;
  summary: string;
  resourceIds: string[];
};

type ResourceForPath = {
  id: string;
  title: string;
  type: string;
  stages: string[];
  tags: string[];
};

function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new Anthropic({ apiKey });
}

function getStageScore(stage: string, resourceStages: string[]) {
  const targetIndex = STAGE_ORDER.indexOf(stage as (typeof STAGE_ORDER)[number]);
  if (targetIndex === -1) return 0;

  return resourceStages.reduce((best, resourceStage) => {
    const resourceIndex = STAGE_ORDER.indexOf(resourceStage as (typeof STAGE_ORDER)[number]);
    if (resourceIndex === -1) return best;

    const distance = Math.abs(resourceIndex - targetIndex);
    const score = Math.max(0, 4 - distance * 2);
    return Math.max(best, score);
  }, 0);
}

function scoreResource(resource: ResourceForPath, answers: OnboardingAnswers, stage: string) {
  let score = getStageScore(stage, resource.stages);
  const normalizedTags = resource.tags.map((tag) => tag.toLowerCase());

  if (GOAL_TAG_HINTS[answers.goal].some((hint) => normalizedTags.includes(hint.toLowerCase()))) {
    score += 3;
  }

  if (STYLE_TYPE_PREFERENCES[answers.learningStyle].includes(resource.type)) {
    score += 2;
  }

  if (TIME_TYPE_PREFERENCES[answers.timeAvailable].includes(resource.type)) {
    score += 1;
  }

  if (answers.goal === "build_products" && resource.stages.includes("building")) {
    score += 2;
  }

  if (answers.goal === "apply_to_work" && resource.stages.includes("applying")) {
    score += 2;
  }

  if (answers.goal === "research" && normalizedTags.includes("research")) {
    score += 2;
  }

  return score;
}

function buildFallbackSummary(answers: OnboardingAnswers, stage: string) {
  const goalCopy: Record<OnboardingAnswers["goal"], string> = {
    stay_informed: "manter repertorio atualizado sem se perder no volume de novidades",
    apply_to_work: "aplicar IA com consistencia no trabalho real",
    build_products: "construir produtos e integracoes com IA",
    research: "aprofundar a base tecnica e investigativa",
  };

  const timeCopy: Record<OnboardingAnswers["timeAvailable"], string> = {
    under_1h: "com pouco tempo disponivel por semana",
    "1_3h": "com uma rotina de estudo enxuta, mas sustentavel",
    "3_5h": "com espaco para aprofundar conceitos e pratica",
    over_5h: "com tempo suficiente para uma trilha mais intensa",
  };

  const styleCopy: Record<OnboardingAnswers["learningStyle"], string> = {
    reading: "priorizando leitura e referencia",
    video: "priorizando explicacoes em video",
    hands_on: "priorizando pratica e ferramentas",
    mixed: "combinando teoria e pratica",
  };

  return `Voce esta na fase ${stage} da jornada em IA. Seu foco agora deve ser ${goalCopy[answers.goal]}, ${timeCopy[answers.timeAvailable]} e ${styleCopy[answers.learningStyle]}. Esta trilha usa uma selecao deterministica de recursos para manter a experiencia funcionando mesmo sem um provedor de IA configurado no deploy.`;
}

export function generateFallbackLearningPath(
  answers: OnboardingAnswers,
  resources: ResourceForPath[]
): PathGenerationResult {
  const stage = answers.experience;
  const rankedIds = resources
    .map((resource) => ({
      id: resource.id,
      score: scoreResource(resource, answers, stage),
    }))
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
    .slice(0, 10)
    .map((resource) => resource.id);

  return {
    stage,
    summary: buildFallbackSummary(answers, stage),
    resourceIds: rankedIds,
  };
}

async function generateAiLearningPath(
  client: Anthropic,
  answers: OnboardingAnswers,
  resources: ResourceForPath[]
): Promise<PathGenerationResult> {
  const resourceList = resources
    .map((r) => `ID: ${r.id} | ${r.title} (${r.type}) | stages: ${r.stages.join(",")} | tags: ${r.tags.join(",")}`)
    .join("\n");

  const userMessage = `User profile:
- Experience level: ${answers.experience}
- Primary goal: ${answers.goal}
- Domain/industry: ${answers.domain}
- Available time per week: ${answers.timeAvailable}
- Preferred learning style: ${answers.learningStyle}

Available resources:
${resourceList}

Respond with JSON only.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Claude returned no JSON");

  return JSON.parse(jsonMatch[0]) as PathGenerationResult;
}

export async function generateLearningPath(
  answers: OnboardingAnswers,
  resources: ResourceForPath[]
): Promise<PathGenerationResult> {
  const client = getAnthropicClient();
  if (!client) {
    return generateFallbackLearningPath(answers, resources);
  }

  try {
    return await generateAiLearningPath(client, answers, resources);
  } catch {
    return generateFallbackLearningPath(answers, resources);
  }
}
