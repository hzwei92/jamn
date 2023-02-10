import { gql } from "@apollo/client";


export const LINK_FIELDS = gql`
  fragment LinkFields on Link {
    id
    prevPostId
    nextPostId
    upvotes
    createDate
    updateDate
    deleteDate
  }
`;