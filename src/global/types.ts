export type MediaDict = {
  [key: string]: { s: { gif: string; mp4: string; u: string } };
};

export type Emoji = {
  a: string;
  u: string;
};

export type RedditComment = {
  kind: "t1" | "more";
  data: {
    author: string;
    author_flair_richtext: Emoji[];
    author_flair_text: string | null;
    body: string;
    created: number;
    depth: number;
    id: string;
    likes: boolean | null;
    media_metadata: MediaDict;
    permalink: string;
    replies: { data: { children: RedditComment[] } };
    score: number;
    score_hidden: boolean;
    stickied: boolean;
  };
};

export type SetStateFunction = () => void;

export type RedditThread = {
  error?: boolean;
  data: {
    created: number;
    id: string;
    num_comments: number;
    subreddit: string;
    subreddit_subscribers: number;
    title: string;
  } | null;
  info: {
    author: string;
    author_flair_richtext: Emoji[];
    author_flair_text: string | null;
    created: number;
    id: string;
    link_flair_richtext: Emoji[];
    link_flair_text: string;
    media_metadata: MediaDict;
    num_comments: number;
    permalink: string;
    score: number;
    selftext: string;
    subreddit: string;
    title: string;
  } | null;
  stickied: RedditComment["data"] | null | undefined;
  comments: RedditComment[];
};
