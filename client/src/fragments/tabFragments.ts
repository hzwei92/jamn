import { gql } from "@apollo/client";

export const TAB_FIELDS = gql`
  fragment TabFields on Tab {
    id
    profileId
    postId
    createDate
    updateDate
    deleteDate
  }
`;