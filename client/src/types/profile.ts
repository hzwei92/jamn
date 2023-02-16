import { Post } from './post';

export type Profile = {
  id: string;
  name: string;
  color: string;
  text: string;
  email: string;
  palette: string;
  balance: number;
  postCount: number;
  tabCount: number;
  leaderCount: number;
  followerCount: number;
  createDate: Date;
  updateDate: Date;
  deleteDate: Date;
}