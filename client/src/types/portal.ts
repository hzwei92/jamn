import { ProfileFilter } from "../enums";

export type DateFilter = {
  startDate: string | null;
  endDate: string | null;
}

export type PortalSlice = {
  profileFilter: ProfileFilter;
  dateRange: DateFilter;
  originalQuery: string;
  query: string;
  entryIds: string[];
}

