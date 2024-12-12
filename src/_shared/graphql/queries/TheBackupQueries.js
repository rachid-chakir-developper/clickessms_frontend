import { gql } from '@apollo/client';
import {
  THE_BACKUP_BASIC_INFOS,
  THE_BACKUP_DETAILS,
  THE_BACKUP_RECAP_DETAILS,
} from '../fragments/TheBackupFragment';

export const GET_THE_BACKUP = gql`
  query GetTheBackup($id: ID!) {
    theBackup(id: $id) {
      ...TheBackupDetailsFragment
    }
  }
  ${THE_BACKUP_DETAILS}
`;

export const GET_THE_BACKUPS = gql`
  query GetTheBackups(
    $theBackupFilter: TheBackupFilterInput
    $offset: Int
    $limit: Int
    $page: Int
  ) {
    theBackups(
      theBackupFilter: $theBackupFilter
      offset: $offset
      limit: $limit
      page: $page
    ) {
      totalCount
      nodes {
        ...TheBackupBasicInfosFragment
      }
    }
  }
  ${THE_BACKUP_BASIC_INFOS}
`;

export const GET_RECAP_THE_BACKUP = gql`
  query GetTheBackup($id: ID!) {
    theBackup(id: $id) {
      ...TheBackupRecapDetailsFragment
    }
  }
  ${THE_BACKUP_RECAP_DETAILS}
`;