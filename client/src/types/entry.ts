import { PostDirection } from "../enums";

export type Entry = {
  id: string;
  parentEntryId: string | null;
  postId: string | null;
  profileId: string;
  linkId: string | null;
  pinId: string | null;
  showDirection: PostDirection | null;
  prevEntryIds: string[];
  nextEntryIds: string[];
  rootEntryIds: string[];
  leafEntryIds: string[];
  shouldFetch: boolean;
}