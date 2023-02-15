import { gql } from "@apollo/client";
import { PROFILE_FIELDS } from "./profileFragments";
import { VOTE_FIELDS } from "./voteFragments";

export const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    profileId
    name
    text
    upvotes
    prevCount
    nextCount
    rootCount
    leafCount
    createDate
    updateDate
    deleteDate
  } 
`;

export const FULL_POST_FIELDS = gql`
  fragment FullPostFields on Post {
    ...PostFields
    profile {
      ...ProfileFields
    }
    currentProfileVote {
      ...VoteFields
    }
  }
  ${POST_FIELDS}
  ${PROFILE_FIELDS}
  ${VOTE_FIELDS}
`