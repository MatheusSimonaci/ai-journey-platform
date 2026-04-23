import { generateFallbackLearningPath, type OnboardingAnswers } from "./claude";

const resources = [
  {
    id: "res_aware_article",
    title: "AI Basics",
    type: "article",
    stages: ["aware"],
    tags: ["fundamentals", "broad"],
  },
  {
    id: "res_exploring_video",
    title: "Prompting Video",
    type: "video",
    stages: ["exploring"],
    tags: ["prompting"],
  },
  {
    id: "res_applying_tool",
    title: "Workflow Tool",
    type: "tool",
    stages: ["applying"],
    tags: ["productivity", "tool"],
  },
  {
    id: "res_building_course",
    title: "Build AI Apps",
    type: "course",
    stages: ["building"],
    tags: ["coding", "API", "architecture"],
  },
];

describe("generateFallbackLearningPath", () => {
  it("uses the experience stage directly", () => {
    const answers: OnboardingAnswers = {
      experience: "exploring",
      goal: "stay_informed",
      domain: "business",
      timeAvailable: "under_1h",
      learningStyle: "video",
    };

    const result = generateFallbackLearningPath(answers, resources);

    expect(result.stage).toBe("exploring");
    expect(result.resourceIds).toHaveLength(4);
    expect(result.resourceIds[0]).toBe("res_exploring_video");
  });

  it("prefers building resources for product builders", () => {
    const answers: OnboardingAnswers = {
      experience: "building",
      goal: "build_products",
      domain: "tech",
      timeAvailable: "over_5h",
      learningStyle: "hands_on",
    };

    const result = generateFallbackLearningPath(answers, resources);

    expect(result.resourceIds[0]).toBe("res_building_course");
    expect(result.summary).toContain("selecao deterministica");
  });
});
