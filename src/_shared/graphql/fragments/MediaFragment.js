// FileFragment.js

import { gql } from '@apollo/client';
import { USER_BASIC_INFOS } from './UserFragment';

export const FILE_MINI_INFOS = gql`
  fragment FileMiniInfosFragment on FileType {
    id
    number
    name
  }
`;

export const FILE_BASIC_INFOS = gql`
  fragment FileBasicInfosFragment on FileType {
    ...FileMiniInfosFragment
    caption
    fileType
    file
    image
    video
    thumbnail
  }
  ${FILE_MINI_INFOS}
`;

export const FILE_DETAILS = gql`
  fragment FileDetailsFragment on FileType {
    ...FileBasicInfosFragment
    description
    observation
    isActive
    createdAt
    updatedAt
    creator{
      ...UserBasicInfosFragment
    }
  }
  ${FILE_BASIC_INFOS}
  ${USER_BASIC_INFOS}
`;

export const CHILD_FILE_DETAILS = gql`
  fragment ChildrenFileDetailsFragment on ChildrenFileType {
    id
    number
    name
    caption
    fileType
    file
    image
    video
    thumbnail
    description
    observation
    isActive
    createdAt
    updatedAt
    creator{
      ...UserBasicInfosFragment
    }
  }
  ${USER_BASIC_INFOS}
`;

export const FOLDER_MINI_INFOS = gql`
  fragment FolderMiniInfosFragment on FolderType {
    id
    number
    name
  }
`;

export const FOLDER_BASIC_INFOS = gql`
  fragment FolderBasicInfosFragment on FolderType {
    ...FolderMiniInfosFragment
    folderType
    description
    observation
    createdAt
    updatedAt
    creator{
        ...UserBasicInfosFragment
    }
  }
  ${FOLDER_MINI_INFOS}
  ${USER_BASIC_INFOS}
`;

export const CHILD_FOLDER_BASIC_INFOS = gql`
  fragment ChildrenFolderBasicInfosFragment on ChildrenFolderType {
    id
    number
    name
    folderType
    description
    observation
    createdAt
    updatedAt
    creator{
        ...UserBasicInfosFragment
    }
  }
  ${USER_BASIC_INFOS}
`;

export const FOLDER_DETAILS = gql`
  fragment FolderDetailsFragment on FolderType {
    ...FolderBasicInfosFragment
    folder{
        ...FolderMiniInfosFragment
    }
    folders{
        ...ChildrenFolderBasicInfosFragment
    }
    files{
        ...ChildrenFileDetailsFragment
    }
  }
  ${FOLDER_MINI_INFOS}
  ${FOLDER_BASIC_INFOS}
  ${CHILD_FOLDER_BASIC_INFOS}
  ${CHILD_FILE_DETAILS}
`;
