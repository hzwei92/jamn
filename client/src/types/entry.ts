import { PostDirection } from "../enums";

export type Entry = {
  id: string;
  postId: string;
  profileId: string;
  parentEntryId: string | null;
  linkId: string | null;
  pinId: string | null;
  showDirection: PostDirection | null;
  prevEntryIds: string[];
  nextEntryIds: string[];
  rootEntryIds: string[];
  leafEntryIds: string[];
  shouldFetch: boolean;
}