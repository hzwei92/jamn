import { Post } from './post';

export type Pin = {
  id: string;
  rootPostId: string;
  rootPost: Post;
  leafPostId: string;
  leafPost: Post;
  upvotes: number;
  createDate: string;
  updateDate: string;
  deleteDate: string | null;
}