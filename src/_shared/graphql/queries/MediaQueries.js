import { gql } from '@apollo/client';
import { FOLDER_DETAILS } from '../fragments/MediaFragment';

export const GET_FOLDER = gql`
  query folder($id: ID!) {
    folder(id: $id) {
      ...FolderDetailsFragment
    }
  }
  ${FOLDER_DETAILS}
`;
