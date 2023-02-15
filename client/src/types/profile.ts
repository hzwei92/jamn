import { Post } from './post';

export type Profile = {
  id: string;
  indexPostId: string | null;
  indexPost: Post | null;
  name: string;
  color: string;
  text: string;
  email: string;
  palette: string;
  balance: number;
  createDate: Date;
  updateDate: Date;
  deleteDate: Date;
}