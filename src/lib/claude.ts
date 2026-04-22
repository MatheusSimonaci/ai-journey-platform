import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

export type OnboardingAnswers = {
  experience: string;
  goal: string;
  domain: string;
  timeAvailable: string;
  learningStyle: string;
};

export type PathGenerationResult = {
  stage: string;
  summary: string;
  resourceIds: string[];
};

export async function generateLearningPath(
  answers: OnboardingAnswers,
  resources: Array<{ id: string; title: string; type: string; stages: string[]; tags: string[] }>
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

  const result = JSON.parse(jsonMatch[0]) as PathGenerationResult;
  return result;
}
