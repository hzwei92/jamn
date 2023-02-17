import { PostDirection } from "../enums";

export type Entry = {
  id: string;
  postId: string | null;
  profileId: string | null;
  linkId: string | null;
  pinId: string | null;
  tabId: string | null;
  showDirection: PostDirection | null;
  prevEntryIds: string[];
  nextEntryIds: string[];
  rootEntryIds: string[];
  leafEntryIds: string[];
  tabEntryIds: string[];
  shouldFetch: boolean;
}