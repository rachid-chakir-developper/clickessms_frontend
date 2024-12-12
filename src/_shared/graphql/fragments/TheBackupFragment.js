// TheBackupFragment.js

import { gql } from '@apollo/client';

export const THE_BACKUP_BASIC_INFOS = gql`
  fragment TheBackupBasicInfosFragment on TheBackupType {
    id
    number
    label
    cycleInDays
	lastBackupDateTime
    description
    observation
    isActive
  }
`;

export const THE_BACKUP_DETAILS = gql`
  fragment TheBackupDetailsFragment on TheBackupType {
    ...TheBackupBasicInfosFragment
  }
  ${THE_BACKUP_BASIC_INFOS}
`;


export const THE_BACKUP_RECAP_DETAILS = gql`
  fragment TheBackupRecapDetailsFragment on TheBackupType {
    ...TheBackupBasicInfosFragment
    createdAt,
    updatedAt,
  }
  ${THE_BACKUP_BASIC_INFOS}
`;
