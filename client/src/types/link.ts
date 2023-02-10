import { Post } from './post';

export type Link = {
  id: string;
  prevPostId: string;
  prevPost: Post;
  nextPostId: string;
  nextPost: Post;
  upvotes: number;
  createDate: string;
  updateDate: string;
  deleteDate: string | null;
}