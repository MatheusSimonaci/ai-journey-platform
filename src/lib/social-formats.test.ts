import { describe, it, expect } from "vitest";
import { formatLinkedIn, formatTwitter, formatInstagram, formatForPlatform } from "./social-formats";

const TITLE = "Como usar IA no dia a dia";
const BODY = "A inteligência artificial está transformando o modo como trabalhamos. Neste artigo, exploramos três formas práticas de integrar ferramentas de IA à sua rotina profissional para ganhar tempo e qualidade.";
const URL = "https://example.com/artigo";
const TAGS = ["ia", "produtividade", "tecnologia"];

describe("formatLinkedIn", () => {
  it("includes title, body and tags", () => {
    const result = formatLinkedIn(TITLE, BODY, URL, TAGS);
    expect(result.text).toContain(TITLE);
    expect(result.text).toContain(BODY);
    expect(result.text).toContain("#ia");
    expect(result.url).toBe(URL);
  });

  it("works without URL and tags", () => {
    const result = formatLinkedIn(TITLE, BODY);
    expect(result.url).toBeUndefined();
    expect(result.text).not.toContain("#");
  });
});

describe("formatTwitter", () => {
  it("each tweet is within 280 chars", () => {
    const result = formatTwitter(TITLE, BODY, URL, TAGS);
    for (const tweet of result.tweets) {
      expect(tweet.length).toBeLessThanOrEqual(280);
    }
  });

  it("produces at least one tweet", () => {
    const result = formatTwitter(TITLE, BODY);
    expect(result.tweets.length).toBeGreaterThan(0);
  });

  it("numbers tweets when more than one", () => {
    const longBody = "a ".repeat(200);
    const result = formatTwitter(TITLE, longBody, URL, TAGS);
    if (result.tweets.length > 1) {
      expect(result.tweets[0]).toMatch(/^1\//);
    }
  });

  it("single tweet has no number prefix", () => {
    const result = formatTwitter("Olá", "Mundo");
    expect(result.tweets[0]).not.toMatch(/^1\//);
  });
});

describe("formatInstagram", () => {
  it("includes caption and hashtags", () => {
    const result = formatInstagram(TITLE, BODY, TAGS);
    expect(result.caption).toContain(TITLE);
    expect(result.hashtags).toContain("#ia");
    expect(result.hashtags).toContain("#produtividade");
  });

  it("hashtags strip spaces", () => {
    const result = formatInstagram(TITLE, BODY, ["machine learning"]);
    expect(result.hashtags).toContain("#machinelearning");
  });
});

describe("formatForPlatform", () => {
  it("routes to correct formatter", () => {
    const linkedin = formatForPlatform("linkedin", TITLE, BODY, URL, TAGS);
    expect(linkedin.platform).toBe("linkedin");

    const twitter = formatForPlatform("twitter", TITLE, BODY, URL, TAGS);
    expect(twitter.platform).toBe("twitter");

    const instagram = formatForPlatform("instagram", TITLE, BODY, URL, TAGS);
    expect(instagram.platform).toBe("instagram");
  });
});
