import { gql } from '@apollo/client';
import { THE_BACKUP_BASIC_INFOS } from '../fragments/TheBackupFragment';

export const POST_THE_BACKUP = gql`
  mutation CreateTheBackup($theBackupData: TheBackupInput!) {
    createTheBackup(theBackupData: $theBackupData) {
      theBackup {
        ...TheBackupBasicInfosFragment
      }
    }
  }
  ${THE_BACKUP_BASIC_INFOS}
`;

export const PUT_THE_BACKUP = gql`
  mutation UpdateTheBackup(
    $id: ID!
    $theBackupData: TheBackupInput!
  ) {
    updateTheBackup(id: $id, theBackupData: $theBackupData) {
      theBackup {
        ...TheBackupBasicInfosFragment
      }
    }
  }
  ${THE_BACKUP_BASIC_INFOS}
`;

export const PUT_THE_BACKUP_STATE = gql`
  mutation UpdateTheBackupState($id: ID!) {
    updateTheBackupState(id: $id) {
      done
      success
      message
      theBackup {
        ...TheBackupBasicInfosFragment
      }
    }
  }
  ${THE_BACKUP_BASIC_INFOS}
`;

export const DELETE_THE_BACKUP = gql`
  mutation DeleteTheBackup($id: ID!) {
    deleteTheBackup(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
