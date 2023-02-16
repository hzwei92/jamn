import { Post } from "./post";
import { Profile } from "./profile";


export type Tab = {
  id: string;
  profileId: string;
  profile: Profile;
  postId: string;
  post: Post;
  createDate: string;
  updateDate: string;
  deleteDate: string | null;
}