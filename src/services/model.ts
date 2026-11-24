export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  author: {
    name: string;
    avatar: string;
  };
  body: string;
  images: string[];
  comments: {
    user: string;
    comment: string;
  }[];
  tags: string[];
};
