
import { gql } from '@apollo/client';
import { FILE_MINI_INFOS, FOLDER_MINI_INFOS } from '../fragments/MediaFragment';


export const POST_FOLDER = gql`
    mutation createFolder($folderData : FolderInput!){
      createFolder(folderData : $folderData) {
        folder {
            ...FolderMiniInfosFragment
          }
        }
    }
    ${FOLDER_MINI_INFOS}
  `
export const PUT_FOLDER = gql`
    mutation updateFolder($id : ID!, $folderData : FolderInput!){
      updateFolder(id : $id, folderData : $folderData) {
        folder {
            ...FolderMiniInfosFragment
          }
        }
    }
    ${FOLDER_MINI_INFOS}
  `
  
export const DELETE_FOLDER = gql`
mutation deleteFolder($id: ID!){
  deleteFolder(id : $id){
    id
    deleted
  }
}
`

export const POST_FILE = gql`
    mutation createFile($fileUpload : Upload!, $fileData : FileInput!){
      createFile(fileUpload: $fileUpload, fileData : $fileData) {
        file {
            ...FileMiniInfosFragment
          }
        }
    }
    ${FILE_MINI_INFOS}
  `
export const PUT_FILE = gql`
    mutation updateFile($id : ID!, $fileUpload : Upload!,  $fileData : FileInput!){
      updateFile(id : $id, fileUpload: $fileUpload, fileData : $fileData) {
        file {
            ...FileMiniInfosFragment
          }
        }
    }
    ${FILE_MINI_INFOS}
  `

export const DELETE_FILE = gql`
mutation deleteFile($id: ID!){
  deleteFile(id : $id){
    id
    deleted
  }
}
`