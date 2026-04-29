const TWITTER_CHAR_LIMIT = 280;
const TWITTER_URL_CHARS = 23; // t.co shortens all URLs to 23 chars

export type LinkedInPost = {
  text: string;
  url?: string;
};

export type TwitterThread = {
  tweets: string[];
};

export type InstagramCaption = {
  caption: string;
  hashtags: string[];
};

export type SocialFormat =
  | { platform: "linkedin"; content: LinkedInPost }
  | { platform: "twitter"; content: TwitterThread }
  | { platform: "instagram"; content: InstagramCaption };

function splitIntoTweets(text: string, urlChars = 0): string[] {
  const limit = TWITTER_CHAR_LIMIT - urlChars;
  const words = text.split(" ");
  const tweets: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= limit) {
      current = candidate;
    } else {
      if (current) tweets.push(current.trim());
      current = word;
    }
  }
  if (current.trim()) tweets.push(current.trim());

  return tweets.map((t, i) =>
    tweets.length > 1 ? `${i + 1}/${tweets.length} ${t}` : t
  );
}

function extractHashtags(tags: string[]): string[] {
  return tags.map((t) => `#${t.replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "")}`).filter(Boolean);
}

export function formatLinkedIn(
  title: string,
  body: string,
  url?: string,
  tags: string[] = []
): LinkedInPost {
  const tagLine = tags.length > 0 ? `\n\n${extractHashtags(tags).join(" ")}` : "";
  const text = `${title}\n\n${body}${tagLine}`;
  return { text, url };
}

export function formatTwitter(
  title: string,
  body: string,
  url?: string,
  tags: string[] = []
): TwitterThread {
  const urlPart = url ? ` ${url}` : "";
  const urlChars = url ? TWITTER_URL_CHARS + 1 : 0; // +1 for space
  const tagLine = tags.length > 0 ? ` ${extractHashtags(tags).slice(0, 3).join(" ")}` : "";
  const fullText = `${title}\n\n${body}`;
  const tweets = splitIntoTweets(fullText, urlChars);

  // Append URL and hashtags to last tweet
  if (tweets.length > 0) {
    const last = tweets[tweets.length - 1];
    tweets[tweets.length - 1] = `${last}${urlPart}${tagLine}`.slice(0, TWITTER_CHAR_LIMIT);
  }

  return { tweets };
}

export function formatInstagram(
  title: string,
  body: string,
  tags: string[] = []
): InstagramCaption {
  const caption = `${title}\n\n${body}`;
  const hashtags = extractHashtags(tags);
  return { caption, hashtags };
}

export function formatForPlatform(
  platform: "linkedin" | "twitter" | "instagram",
  title: string,
  body: string,
  url?: string,
  tags: string[] = []
): SocialFormat {
  switch (platform) {
    case "linkedin":
      return { platform, content: formatLinkedIn(title, body, url, tags) };
    case "twitter":
      return { platform, content: formatTwitter(title, body, url, tags) };
    case "instagram":
      return { platform, content: formatInstagram(title, body, tags) };
  }
}
