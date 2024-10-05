export type RedditComment = {
  kind: "t1" | "more";
  data: {
    author: string;
    author_flair_richtext: object[];
    author_flair_text: string | null;
    body: string;
    created: number;
    depth: number;
    id: string;
    likes: boolean | null;
    media_metadata: object;
    permalink: string;
    replies: { data: { children: RedditComment[] } };
    score: number;
    score_hidden: boolean;
  };
};

export type SetStateFunction = () => void;

export type RedditThread = {
  info: object | null;
  stickied: RedditComment | null | undefined;
  comments: RedditComment[];
};
