import { gql } from "@apollo/client";

export const PIN_FIELDS = gql`
  fragment PinFields on Pin {
    id
    rootPostId
    leafPostId
    upvotes
    createDate
    updateDate
    deleteDate
  }
`;