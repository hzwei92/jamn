import { gql } from "@apollo/client";

export const PROFILE_FIELDS = gql`
  fragment ProfileFields on Profile {
    id
    name
    email
    color
    text
    palette
    balance
    createDate
    updateDate
    deleteDate
  }
`;
