import { gql } from "@apollo/client";

export const PROFILE_FIELDS = gql`
  fragment ProfileFields on Profile {
    id
    indexPostId
    name
    email
    color
    text
    palette
    balance
    postCount
    tabCount
    leaderCount
    followerCount
    createDate
    updateDate
    deleteDate
  }
`;
