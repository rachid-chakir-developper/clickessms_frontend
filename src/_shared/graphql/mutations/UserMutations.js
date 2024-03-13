import { gql } from '@apollo/client';
import { USER_BASIC_INFOS } from '../fragments/UserFragment';

export const POST_USER = gql`
  mutation CreateUser($userData: UserInput!, $photo : Upload, $coverImage : Upload, $userGroups : [Int], $userPermissions : [Int]) {
    createUser(userData: $userData, photo : $photo, coverImage : $coverImage, userGroups : $userGroups, userPermissions : $userPermissions){
      user{
        ...UserBasicInfosFragment
      }
    }
  }
  ${USER_BASIC_INFOS}
`;

export const PUT_USER = gql`
  mutation UpdateUser($id: ID!, $userData: UserInput!, $photo : Upload, $coverImage : Upload, $userGroups : [Int], $userPermissions : [Int]) {
    updateUser(id: $id, userData: $userData, photo : $photo, coverImage : $coverImage, userGroups : $userGroups, userPermissions : $userPermissions) {
      user{
        ...UserBasicInfosFragment
      }
    }
  }
  ${USER_BASIC_INFOS}
`;

export const PUT_USER_STATE = gql`
  mutation UpdateUserState($id: ID!) {
    updateUserState(id: $id){
      done
      success
      message
      user{
        ...UserBasicInfosFragment
      }
    }
  }
  ${USER_BASIC_INFOS}
`;


export const PUT_USER_LOCALISATION = gql`
  mutation UpdateUserCurrentLocalisation($currentLocalisationData: CurrentLocalisationInput!) {
    updateUserCurrentLocalisation(currentLocalisationData: $currentLocalisationData){
      success
      done
      message
    }
  }
`;

export const PUT_MY_PASSWORD = gql`
  mutation passwordChange(
    $oldPassword: String!,
    $newPassword1: String!,
    $newPassword2: String!
  ){
    passwordChange(
      oldPassword : $oldPassword,
      newPassword1 : $newPassword1,
      newPassword2 : $newPassword2,
    ){
      success,
      errors,
      token,
      refreshToken
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id){
      id
      success
      deleted
      message
    }
  }
`;

export const POST_GROUP = gql`
  mutation createGroup($name: String!, $groupPermissions : [Int]!){
    createGroup(name: $name , groupPermissions : $groupPermissions) {
        group {
          id,
          name,
          permissions{
            id,
            name
          }
        }
      }
  }
`
export const PUT_GROUP = gql`
  mutation updateGroup($id : ID!, $name: String!, $groupPermissions : [Int]!){
    updateGroup(id : $id, name: $name, groupPermissions  : $groupPermissions ) {
        group {
          id,
          name,
          permissions{
            id,
            name
          }
        }
      }
  }
`
export const DELETE_GROUP = gql`
  mutation deleteGroup($id: ID!){
    deleteGroup(id : $id){
      id
      deleted
    }
  }
`
