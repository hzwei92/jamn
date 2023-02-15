import { gql } from "@apollo/client";


export const VOTE_FIELDS = gql`
  fragment VoteFields on Vote {
    id
    profileId
    postId
    value
    createDate
    updateDate
    deleteDate
  }
`