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
  { title: "ChatGPT Prompt Engineering for Beginners", url: "https://learn.deeplearning.ai/chatgpt-prompt-eng", type: "course", stages: ["aware", "exploring"], tags: ["prompting", "hands-on"], description: "Free short course on writing effective prompts." },

  // EXPLORING stage
  { title: "Practical Deep Learning for Coders (fast.ai)", url: "https://course.fast.ai", type: "course", stages: ["exploring", "applying"], tags: ["deep learning", "coding"], description: "Top-down practical approach to deep learning." },
  { title: "The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/", type: "article", stages: ["exploring", "applying"], tags: ["transformer", "visual", "LLM"], description: "Visual deep dive into transformer architecture." },
  { title: "LangChain Quickstart", url: "https://python.langchain.com/docs/get_started/quickstart", type: "article", stages: ["exploring", "applying"], tags: ["LangChain", "tools"], description: "Build LLM-powered apps with LangChain." },
  { title: "Andrej Karpathy – Let's build GPT from scratch", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", type: "video", stages: ["exploring", "building"], tags: ["GPT", "coding", "deep dive"], description: "From-scratch GPT implementation in ~2 hours." },
  { title: "Prompt Engineering Guide", url: "https://www.promptingguide.ai", type: "article", stages: ["exploring", "applying"], tags: ["prompting", "reference"], description: "Comprehensive guide to prompting techniques." },
  { title: "Hugging Face Course", url: "https://huggingface.co/learn/nlp-course", type: "course", stages: ["exploring", "applying", "building"], tags: ["NLP", "transformers", "coding"], description: "Free course on NLP with Transformers." },
  { title: "AI Product Strategy (a16z)", url: "https://a16z.com/ai-product-strategy/", type: "article", stages: ["exploring", "applying"], tags: ["product", "strategy"], description: "Framework for building AI products." },
  { title: "No Priors Podcast", url: "https://www.nopriorsshow.com", type: "video", stages: ["exploring", "applying"], tags: ["podcast", "product", "industry"], description: "AI product and industry discussions." },
  { title: "State of AI Report 2024", url: "https://www.stateof.ai", type: "article", stages: ["exploring", "applying", "building"], tags: ["trends", "research"], description: "Annual overview of AI progress." },
  { title: "AI Snake Oil Book Summary", url: "https://www.aisnakeoil.com", type: "article", stages: ["exploring"], tags: ["critical thinking", "ethics"], description: "Critical look at AI hype vs reality." },

  // APPLYING stage
  { title: "Anthropic Claude API Docs", url: "https://docs.anthropic.com", type: "article", stages: ["applying", "building"], tags: ["Claude", "API", "reference"], description: "Official documentation for Claude API." },
  { title: "OpenAI API Cookbook", url: "https://cookbook.openai.com", type: "article", stages: ["applying", "building"], tags: ["OpenAI", "API", "examples"], description: "Practical code examples for OpenAI APIs." },
  { title: "Building with LLMs – Chip Huyen", url: "https://huyenchip.com/2023/04/11/llm-engineering.html", type: "article", stages: ["applying", "building"], tags: ["LLM engineering", "production"], description: "Engineering considerations for LLM apps." },
  { title: "RAG from Scratch (LangChain)", url: "https://github.com/langchain-ai/rag-from-scratch", type: "article", stages: ["applying", "building"], tags: ["RAG", "retrieval", "coding"], description: "Build retrieval-augmented generation systems." },
  { title: "LLM Bootcamp – Full Stack Deep Learning", url: "https://fullstackdeeplearning.com/llm-bootcamp/", type: "course", stages: ["applying", "building"], tags: ["LLM", "production", "full stack"], description: "End-to-end LLM application development." },
  { title: "Evaluating LLM Applications", url: "https://www.honeyhive.ai/blog/llm-evaluation", type: "article", stages: ["applying", "building"], tags: ["eval", "quality", "production"], description: "How to measure and improve LLM app quality." },
  { title: "AI in Healthcare: Use Cases", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/AI-healthcare", type: "article", stages: ["applying"], tags: ["healthcare", "domain"], description: "AI applications in clinical settings." },
  { title: "AI for Marketing – Practical Guide", url: "https://hbr.org/ai-marketing", type: "article", stages: ["applying"], tags: ["marketing", "domain", "business"], description: "Applying AI tools in marketing workflows." },
  { title: "GitHub Copilot for Developers", url: "https://docs.github.com/en/copilot", type: "tool", stages: ["applying", "building"], tags: ["coding", "productivity", "tool"], description: "AI-powered code completion in your IDE." },
  { title: "Notion AI – Workflow Integration", url: "https://www.notion.so/product/ai", type: "tool", stages: ["applying"], tags: ["productivity", "writing", "tool"], description: "AI writing and summarization inside Notion." },

  // BUILDING stage
  { title: "Designing ML Systems – Chip Huyen (Book)", url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/", type: "book", stages: ["building"], tags: ["MLOps", "systems", "production"], description: "Comprehensive guide to production ML systems." },
  { title: "Fine-tuning LLMs with PEFT", url: "https://huggingface.co/blog/peft", type: "article", stages: ["building"], tags: ["fine-tuning", "PEFT", "LoRA"], description: "Efficient fine-tuning techniques for LLMs." },
  { title: "Vector Databases Explained", url: "https://www.pinecone.io/learn/vector-database/", type: "article", stages: ["building"], tags: ["vector DB", "embeddings", "search"], description: "How vector databases power AI search." },
  { title: "Vercel AI SDK Documentation", url: "https://sdk.vercel.ai/docs", type: "article", stages: ["building"], tags: ["Vercel", "streaming", "Next.js"], description: "Build streaming AI apps with Next.js and Vercel." },
  { title: "LLM Observability with LangSmith", url: "https://docs.smith.langchain.com", type: "tool", stages: ["building"], tags: ["observability", "debugging", "LLM"], description: "Trace and debug LLM application calls." },
  { title: "Agents with Tool Use – Anthropic", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", type: "article", stages: ["building"], tags: ["agents", "tool use", "Claude"], description: "Build AI agents using Claude's tool use capability." },
  { title: "AI Security: Prompt Injection Attacks", url: "https://simonwillison.net/2023/Apr/14/worst-that-can-happen/", type: "article", stages: ["building"], tags: ["security", "prompt injection", "safety"], description: "Understanding and preventing prompt injection." },
  { title: "Latency Optimization for LLM Apps", url: "https://www.anyscale.com/blog/llm-latency", type: "article", stages: ["building"], tags: ["performance", "latency", "production"], description: "Techniques to reduce LLM response times." },
  { title: "MLflow for Experiment Tracking", url: "https://mlflow.org/docs/latest/index.html", type: "tool", stages: ["building"], tags: ["MLOps", "experiment tracking"], description: "Track ML experiments, models, and deployments." },
  { title: "The Architecture of Modern AI Systems", url: "https://www.sequoiacap.com/article/ai-architecture/", type: "article", stages: ["building"], tags: ["architecture", "systems design"], description: "How production AI systems are architected." },
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
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
