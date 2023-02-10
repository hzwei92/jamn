import { Profile } from "./profile";

export type Post = {
  id: string;
  profileId: string;
  profile: Profile;
  name: string | null;
  text: string;
  upvotes: number;
  prevCount: number;
  nextCount: number;
  rootCount: number;
  leafCount: number;
  createDate: string;
  updateDate: string;
  deleteDate: string | null;
};