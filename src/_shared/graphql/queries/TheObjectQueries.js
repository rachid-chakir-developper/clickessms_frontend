import { gql } from '@apollo/client';
import { THE_OBJECT_BASIC_INFOS, THE_OBJECT_DETAILS, THE_OBJECT_RECAP_DETAILS } from '../fragments/TheObjectFragment';

export const GET_THE_OBJECT = gql`
  query GetTheObject($id: ID!) {
    theObject(id: $id) {
      ...TheObjectDetailsFragment
    }
  }
  ${THE_OBJECT_DETAILS}
`;

export const GET_THE_OBJECTS = gql`
  query GetTheObjects($theObjectFilter: TheObjectFilterInput, $offset: Int, $limit: Int, $page: Int){
    theObjects(theObjectFilter : $theObjectFilter, offset : $offset, limit : $limit, page : $page){
      totalCount
      nodes{
        ...TheObjectBasicInfosFragment
      }
    }
  }
  ${THE_OBJECT_BASIC_INFOS}
`;


export const THE_OBJECT_RECAP = gql`
  query GetTheObject($id: ID!) {
    theObject(id: $id) {
      ...TheObjectRecapDetailsFragment
    }
  }
  ${THE_OBJECT_RECAP_DETAILS}
`;
// Add more theObject-related queries here
