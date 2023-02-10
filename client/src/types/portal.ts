import { ProfileFilter } from "../enums";

export type PortalSlice = {
  profileFilter: ProfileFilter;
  originalQuery: string;
  query: string;
  entryIds: string[];
}

