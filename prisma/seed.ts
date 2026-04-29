import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const resources = [
  // AWARE stage
  { title: "What is Artificial Intelligence?", url: "https://www.ibm.com/topics/artificial-intelligence", type: "article", stages: ["aware"], tags: ["intro", "fundamentals"], description: "IBM's beginner guide to AI concepts." },
  { title: "AI For Everyone – Andrew Ng (Coursera)", url: "https://www.coursera.org/learn/ai-for-everyone", type: "course", stages: ["aware", "exploring"], tags: ["fundamentals", "business"], description: "Non-technical course covering AI strategy and applications." },
  { title: "Elements of AI (University of Helsinki)", url: "https://www.elementsofai.com", type: "course", stages: ["aware", "exploring"], tags: ["fundamentals", "free"], description: "Free online intro course on AI." },
  { title: "The AI Revolution: The Road to Superintelligence", url: "https://waitbutwhy.com/2015/01/artificial-intelligence-revolution-1.html", type: "article", stages: ["aware"], tags: ["big picture", "reading"], description: "Accessible long read on the future of AI." },
  { title: "How ChatGPT Works", url: "https://www.youtube.com/watch?v=0l0_sy0KYD0", type: "video", stages: ["aware", "exploring"], tags: ["LLM", "explainer"], description: "Visual explanation of how large language models work." },
  { title: "AI Glossary for Beginners", url: "https://www.deeplearning.ai/resources/glossary/", type: "article", stages: ["aware"], tags: ["glossary", "reference"], description: "Essential AI vocabulary explained simply." },
  { title: "Lex Fridman Podcast – AI Overview Episodes", url: "https://lexfridman.com/podcast/", type: "video", stages: ["aware", "exploring"], tags: ["podcast", "broad"], description: "Accessible conversations with AI researchers and builders." },
  { title: "ChatGPT Prompt Engineering for Developers (DeepLearning.AI)", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", type: "course", stages: ["aware", "exploring"], tags: ["prompting", "hands-on"], description: "Free short course on writing effective prompts — co-created with OpenAI." },

  // EXPLORING stage
  { title: "Practical Deep Learning for Coders (fast.ai)", url: "https://course.fast.ai", type: "course", stages: ["exploring", "applying"], tags: ["deep learning", "coding"], description: "Top-down practical approach to deep learning." },
  { title: "The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/", type: "article", stages: ["exploring", "applying"], tags: ["transformer", "visual", "LLM"], description: "Visual deep dive into transformer architecture." },
  { title: "LangChain Quickstart", url: "https://python.langchain.com/docs/get_started/quickstart", type: "article", stages: ["exploring", "applying"], tags: ["LangChain", "tools"], description: "Build LLM-powered apps with LangChain." },
  { title: "Andrej Karpathy – Let's build GPT from scratch", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", type: "video", stages: ["exploring", "building"], tags: ["GPT", "coding", "deep dive"], description: "From-scratch GPT implementation in ~2 hours." },
  { title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai", type: "article", stages: ["exploring", "applying"], tags: ["prompting", "reference"], description: "Comprehensive guide to prompting techniques." },
  { title: "Hugging Face Course", url: "https://huggingface.co/learn/nlp-course", type: "course", stages: ["exploring", "applying", "building"], tags: ["NLP", "transformers", "coding"], description: "Free course on NLP with Transformers." },
  { title: "AI Canon — a16z", url: "https://a16z.com/ai-canon/", type: "article", stages: ["exploring", "applying"], tags: ["product", "strategy", "reading-list"], description: "Curated reading list of the most important AI papers and resources, maintained by a16z." },
  { title: "No Priors Podcast", url: "https://www.nopriorsshow.com", type: "video", stages: ["exploring", "applying"], tags: ["podcast", "product", "industry"], description: "AI product and industry discussions." },
  { title: "State of AI Report 2024", url: "https://www.stateof.ai", type: "article", stages: ["exploring", "applying", "building"], tags: ["trends", "research"], description: "Annual overview of AI progress." },
  { title: "AI Snake Oil Book Summary", url: "https://www.aisnakeoil.com", type: "article", stages: ["exploring"], tags: ["critical thinking", "ethics"], description: "Critical look at AI hype vs reality." },

  // APPLYING stage
  { title: "Anthropic Claude API Docs", url: "https://docs.anthropic.com", type: "article", stages: ["applying", "building"], tags: ["Claude", "API", "reference"], description: "Official documentation for Claude API." },
  { title: "OpenAI API Cookbook", url: "https://cookbook.openai.com", type: "article", stages: ["applying", "building"], tags: ["OpenAI", "API", "examples"], description: "Practical code examples for OpenAI APIs." },
  { title: "Building with LLMs – Chip Huyen", url: "https://huyenchip.com/2023/04/11/llm-engineering.html", type: "article", stages: ["applying", "building"], tags: ["LLM engineering", "production"], description: "Engineering considerations for LLM apps." },
  { title: "RAG from Scratch (LangChain)", url: "https://github.com/langchain-ai/rag-from-scratch", type: "article", stages: ["applying", "building"], tags: ["RAG", "retrieval", "coding"], description: "Build retrieval-augmented generation systems." },
  { title: "LLM Bootcamp – Full Stack Deep Learning", url: "https://fullstackdeeplearning.com/llm-bootcamp/", type: "course", stages: ["applying", "building"], tags: ["LLM", "production", "full stack"], description: "End-to-end LLM application development." },
  { title: "Building Evals for LLM Applications — Anthropic", url: "https://docs.anthropic.com/en/docs/test-and-evaluate/eval-tool", type: "article", stages: ["applying", "building"], tags: ["eval", "quality", "production"], description: "How to measure and improve LLM application quality using Anthropic's evaluation tooling." },
  { title: "How to Use AI to Do Practical Stuff — Ethan Mollick", url: "https://www.oneusefulthing.org/p/how-to-use-ai-to-do-practical-stuff", type: "article", stages: ["applying"], tags: ["practical", "productivity", "domain"], description: "Concrete, research-backed guide to using AI in your actual work." },
  { title: "Lenny's Newsletter — AI for PMs", url: "https://www.lennysnewsletter.com/p/a-product-managers-guide-to-ai", type: "article", stages: ["applying"], tags: ["product", "ai-tools", "management"], description: "How product managers can use AI tools to work faster and better." },
  { title: "GitHub Copilot for Developers", url: "https://docs.github.com/en/copilot", type: "tool", stages: ["applying", "building"], tags: ["coding", "productivity", "tool"], description: "AI-powered code completion in your IDE." },
  { title: "Notion AI – Workflow Integration", url: "https://www.notion.so/product/ai", type: "tool", stages: ["applying"], tags: ["productivity", "writing", "tool"], description: "AI writing and summarization inside Notion." },

  // BUILDING stage
  { title: "Designing ML Systems – Chip Huyen", url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/", type: "article", stages: ["building"], tags: ["MLOps", "systems", "production"], description: "Comprehensive guide to production ML systems — covers data pipelines, training, deployment, and monitoring." },
  { title: "Fine-tuning LLMs with PEFT", url: "https://huggingface.co/blog/peft", type: "article", stages: ["building"], tags: ["fine-tuning", "PEFT", "LoRA"], description: "Efficient fine-tuning techniques for LLMs." },
  { title: "Vector Databases Explained", url: "https://www.pinecone.io/learn/vector-database/", type: "article", stages: ["building"], tags: ["vector DB", "embeddings", "search"], description: "How vector databases power AI search." },
  { title: "Vercel AI SDK Documentation", url: "https://sdk.vercel.ai/docs", type: "article", stages: ["building"], tags: ["Vercel", "streaming", "Next.js"], description: "Build streaming AI apps with Next.js and Vercel." },
  { title: "LLM Observability with LangSmith", url: "https://docs.smith.langchain.com", type: "tool", stages: ["building"], tags: ["observability", "debugging", "LLM"], description: "Trace and debug LLM application calls." },
  { title: "Agents with Tool Use – Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", type: "article", stages: ["building"], tags: ["agents", "tool use", "Claude"], description: "Build AI agents using Claude's tool use capability." },
  { title: "AI Security: Prompt Injection Attacks", url: "https://simonwillison.net/2023/Apr/14/worst-that-can-happen/", type: "article", stages: ["building"], tags: ["security", "prompt injection", "safety"], description: "Understanding and preventing prompt injection." },
  { title: "Prompt Caching with Claude — Latency & Cost Optimization", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", type: "article", stages: ["building"], tags: ["performance", "latency", "cost", "caching"], description: "How to use Claude's prompt caching to dramatically reduce latency and API costs for production apps." },
  { title: "MLflow for Experiment Tracking", url: "https://mlflow.org/docs/latest/index.html", type: "tool", stages: ["building"], tags: ["MLOps", "experiment tracking"], description: "Track ML experiments, models, and deployments." },
  { title: "Emerging Architectures for LLM Applications — a16z", url: "https://a16z.com/emerging-architectures-for-llm-applications/", type: "article", stages: ["building"], tags: ["architecture", "systems-design", "llm"], description: "How production LLM applications are architected: context management, retrieval, orchestration." },
  { title: "Anthropic Prompt Library", url: "https://docs.anthropic.com/en/prompt-library/library", type: "tool", stages: ["applying", "building"], tags: ["prompts", "examples", "Claude"], description: "Curated prompts for common use cases with Claude." },

  // Cross-stage resources
  { title: "MIT OpenCourseWare: Introduction to Machine Learning", url: "https://ocw.mit.edu/courses/6-867-machine-learning-fall-2006/", type: "course", stages: ["exploring", "applying", "building"], tags: ["ML", "academic", "free"], description: "Free MIT course on machine learning fundamentals." },
  { title: "Papers with Code", url: "https://paperswithcode.com", type: "tool", stages: ["applying", "building"], tags: ["research", "papers", "code"], description: "Latest AI research papers with open-source implementations." },
  { title: "DeepLearning.AI Short Courses", url: "https://www.deeplearning.ai/short-courses/", type: "course", stages: ["exploring", "applying", "building"], tags: ["short courses", "practical"], description: "Focused 1-2 hour courses on specific AI topics." },
  { title: "The Batch Newsletter (DeepLearning.AI)", url: "https://www.deeplearning.ai/the-batch/", type: "article", stages: ["aware", "exploring", "applying", "building"], tags: ["newsletter", "news"], description: "Weekly AI news and insights from Andrew Ng." },
  { title: "Kaggle Learn", url: "https://www.kaggle.com/learn", type: "course", stages: ["exploring", "applying"], tags: ["hands-on", "data science", "free"], description: "Free hands-on courses with datasets and notebooks." },
  { title: "Two Minute Papers", url: "https://www.youtube.com/@TwoMinutePapers", type: "video", stages: ["exploring", "applying", "building"], tags: ["research", "video", "summaries"], description: "AI research explained in 2-minute videos." },
  { title: "Andrej Karpathy – Neural Networks: Zero to Hero", url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", type: "video", stages: ["exploring", "building"], tags: ["neural networks", "from scratch", "coding"], description: "Complete neural network fundamentals course." },
  { title: "AI Ethics: A Practical Introduction", url: "https://ethics-of-ai.mooc.fi", type: "course", stages: ["aware", "exploring", "applying"], tags: ["ethics", "responsible AI"], description: "Free course on AI ethics and societal impact." },
  { title: "Google Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course", type: "course", stages: ["exploring", "applying"], tags: ["ML", "Google", "free"], description: "Free ML course with TensorFlow by Google." },
  { title: "fast.ai – Practical Deep Learning Part 2", url: "https://course.fast.ai/Lessons/part2.html", type: "course", stages: ["building"], tags: ["deep learning", "advanced", "research"], description: "Advanced deep learning: build models from scratch." },
  { title: "Simon Willison's LLM CLI Tool", url: "https://llm.datasette.io/en/stable/", type: "tool", stages: ["exploring", "building"], tags: ["cli", "llm", "open-source", "local"], description: "Command-line tool for running LLMs locally and via APIs. Great for prototyping and scripting AI workflows." },
];

// Domain-specific track resources
const trackResources = [
  // AI for Legal track resources
  {
    trackSlug: "ai-for-legal",
    resources: [
      { title: "AI for Lawyers: A Practical Guide", url: "https://www.americanbar.org/groups/law_practice/publications/techreport/2024/", type: "article", tags: ["legal", "practical", "lawyers"], description: "ABA guide on practical AI use for legal professionals." },
      { title: "ChatGPT in Legal Practice: Risks and Rewards", url: "https://www.lawsociety.org.uk/topics/research/use-of-ai-in-legal-practice", type: "article", tags: ["legal", "risk", "compliance"], description: "Law Society assessment of AI risks and opportunities in legal practice." },
      { title: "Clio AI for Legal Teams", url: "https://www.clio.com/features/clio-duo/", type: "tool", tags: ["legal", "tool", "productivity"], description: "AI-powered legal practice management with document drafting and research." },
      { title: "Prompt Engineering for Legal Documents", url: "https://www.promptingguide.ai", type: "article", tags: ["prompting", "legal", "drafting"], description: "How to write effective prompts for contract review, legal memos, and briefs." },
      { title: "Harvey AI – Legal AI Assistant", url: "https://www.harvey.ai", type: "tool", tags: ["legal", "AI tool", "contracts"], description: "Purpose-built AI for law firms: contract review, due diligence, and regulatory analysis." },
      { title: "AI in Legal Research: LexisNexis AI", url: "https://www.lexisnexis.com/en-us/products/lexis-plus-ai.page", type: "tool", tags: ["legal research", "AI tool"], description: "AI-powered legal research with citation analysis and case summarization." },
      { title: "AI Ethics for Legal Professionals", url: "https://ethics-of-ai.mooc.fi", type: "course", tags: ["ethics", "legal", "AI responsibility"], description: "Ethics principles directly applicable to attorney AI use and client confidentiality." },
      { title: "Contract Review with AI: A Step-by-Step Guide", url: "https://www.oneusefulthing.org/p/how-to-use-ai-to-do-practical-stuff", type: "article", tags: ["contracts", "practical", "legal"], description: "Research-backed methods for using AI to review contracts faster and more accurately." },
    ],
  },
  // AI for Creative track resources
  {
    trackSlug: "ai-for-creative",
    resources: [
      { title: "Midjourney for Designers: Getting Started", url: "https://docs.midjourney.com/hc/en-us/articles/360043691131-Quick-Start", type: "article", tags: ["design", "image generation", "Midjourney"], description: "Official guide to generating images with Midjourney for creative projects." },
      { title: "Adobe Firefly: AI for Creative Workflows", url: "https://helpx.adobe.com/firefly/get-started.html", type: "tool", tags: ["design", "Adobe", "AI art"], description: "Adobe's generative AI integrated into Creative Cloud — ideation, mockups, and asset generation." },
      { title: "AI Copywriting with Claude: Practical Patterns", url: "https://docs.anthropic.com/en/prompt-library/library", type: "tool", tags: ["copywriting", "Claude", "content"], description: "Curated prompts for creative writing, campaign copy, and brand voice." },
      { title: "Runway ML: Video and Motion AI", url: "https://runwayml.com/learn/", type: "tool", tags: ["video", "motion", "AI video"], description: "AI video generation and editing tools for creative professionals." },
      { title: "AI in Music Production: Suno and Udio", url: "https://suno.com/blog/introducing-suno", type: "article", tags: ["music", "audio", "AI creative"], description: "How AI music tools are changing composition and sound design workflows." },
      { title: "Prompt Engineering for Creative Work", url: "https://www.promptingguide.ai", type: "article", tags: ["prompting", "creative", "image generation"], description: "Writing prompts that produce consistent, on-brand creative output." },
      { title: "Notion AI for Content Creators", url: "https://www.notion.so/product/ai", type: "tool", tags: ["content", "writing", "workflow"], description: "AI writing assistance for brainstorming, drafting, and editing content at scale." },
      { title: "The Future of Creative Work with AI – Ethan Mollick", url: "https://www.oneusefulthing.org/p/how-to-use-ai-to-do-practical-stuff", type: "article", tags: ["creative", "future of work", "AI strategy"], description: "Research-based perspective on how AI is reshaping creative professions." },
      { title: "Figma AI: Design Faster with AI", url: "https://www.figma.com/ai/", type: "tool", tags: ["design", "Figma", "UI/UX"], description: "AI features in Figma for generating UI components, copy, and design suggestions." },
    ],
  },
  // AI for Tech Management track resources
  {
    trackSlug: "ai-for-tech-management",
    resources: [
      { title: "AI for Product Managers – Lenny's Newsletter", url: "https://www.lennysnewsletter.com/p/a-product-managers-guide-to-ai", type: "article", tags: ["product management", "AI tools", "PM"], description: "Comprehensive guide for PMs: how to use AI to move faster and build better products." },
      { title: "AI For Everyone – Andrew Ng (Coursera)", url: "https://www.coursera.org/learn/ai-for-everyone", type: "course", tags: ["AI strategy", "management", "non-technical"], description: "Essential non-technical course for tech managers on AI strategy and execution." },
      { title: "Building AI Products: a16z Guide", url: "https://a16z.com/ai-canon/", type: "article", tags: ["product", "AI strategy", "leadership"], description: "Strategic frameworks from a16z for leading teams that build AI products." },
      { title: "GitHub Copilot for Engineering Teams", url: "https://docs.github.com/en/copilot", type: "tool", tags: ["engineering", "productivity", "AI tools"], description: "How to evaluate, roll out, and measure GitHub Copilot adoption across your team." },
      { title: "AI Strategy for Tech Leads: State of AI Report", url: "https://www.stateof.ai", type: "article", tags: ["strategy", "trends", "leadership"], description: "Annual benchmark report — essential reading for tech managers tracking the AI landscape." },
      { title: "Managing AI Engineering Teams", url: "https://huyenchip.com/2023/04/11/llm-engineering.html", type: "article", tags: ["LLM engineering", "team management", "production"], description: "Engineering and organizational considerations for leading LLM-powered product development." },
      { title: "No Priors Podcast – AI Product and Leadership", url: "https://www.nopriorsshow.com", type: "video", tags: ["podcast", "leadership", "product strategy"], description: "Conversations with AI product leaders on strategy, hiring, and building in the AI era." },
      { title: "Emerging Architectures for LLM Apps — a16z", url: "https://a16z.com/emerging-architectures-for-llm-applications/", type: "article", tags: ["architecture", "technical leadership", "LLM"], description: "System design patterns tech leads must understand to make sound AI architectural decisions." },
      { title: "Notion AI for Team Operations", url: "https://www.notion.so/product/ai", type: "tool", tags: ["operations", "team productivity", "AI tools"], description: "AI-powered documentation, meeting notes, and knowledge management for tech teams." },
    ],
  },
];

const tracks = [
  {
    id: "track_legal",
    slug: "ai-for-legal",
    title: "IA para Jurídico",
    description: "Para advogados, consultores jurídicos e profissionais do direito que querem usar IA para revisar contratos, pesquisar precedentes e redigir documentos com mais velocidade e precisão.",
    icon: "⚖️",
    color: "blue",
    domain: "legal",
  },
  {
    id: "track_creative",
    slug: "ai-for-creative",
    title: "IA para Criativos",
    description: "Para designers, redatores, artistas e criadores de conteúdo que querem integrar IA na produção visual, textual e audiovisual — do conceito à entrega final.",
    icon: "🎨",
    color: "purple",
    domain: "creative",
  },
  {
    id: "track_tech_mgmt",
    slug: "ai-for-tech-management",
    title: "IA para Gestão de Tech",
    description: "Para product managers, tech leads e gestores de tecnologia que precisam entender IA para tomar decisões estratégicas, liderar equipes de engenharia e avaliar soluções de mercado.",
    icon: "🚀",
    color: "orange",
    domain: "tech_management",
  },
];

async function main() {
  console.log("Seeding resources...");

  for (const [i, resource] of resources.entries()) {
    const id = `res_${String(i + 1).padStart(3, "0")}`;
    await db.resource.upsert({
      where: { id },
      create: { id, ...resource },
      update: resource,
    });
  }

  console.log(`Seeded ${resources.length} resources.`);

  console.log("Seeding domain tracks...");

  for (const track of tracks) {
    await db.track.upsert({
      where: { slug: track.slug },
      create: track,
      update: { title: track.title, description: track.description, icon: track.icon, color: track.color, domain: track.domain },
    });
  }

  for (const trackData of trackResources) {
    const track = await db.track.findUnique({ where: { slug: trackData.trackSlug } });
    if (!track) continue;

    for (const [i, res] of trackData.resources.entries()) {
      const resourceId = `track_res_${trackData.trackSlug.replace(/-/g, "_")}_${String(i + 1).padStart(2, "0")}`;
      const resource = await db.resource.upsert({
        where: { id: resourceId },
        create: { id: resourceId, ...res, stages: ["aware", "exploring", "applying"] },
        update: { ...res },
      });

      await db.trackResource.upsert({
        where: { trackId_resourceId: { trackId: track.id, resourceId: resource.id } },
        create: { trackId: track.id, resourceId: resource.id, order: i + 1 },
        update: { order: i + 1 },
      });
    }
  }

  console.log(`Seeded ${tracks.length} tracks with their resources.`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
