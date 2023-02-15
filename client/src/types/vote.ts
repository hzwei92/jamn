import { Post } from "./post";
import { Profile } from "./profile";


export type Vote = {
  id: string;
  profileId: string;
  profile: Profile;
  postId: string;
  post: Post;
  value: number;
  createDate: string;
  updateDate: string;
  deleteDate: string | null;
}