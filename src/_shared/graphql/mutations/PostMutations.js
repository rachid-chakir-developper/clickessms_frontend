import { gql } from '@apollo/client';
import { POST_BASIC_INFOS } from '../fragments/PostFragment';

export const POST_POST = gql`
  mutation CreatePost(
    $postData: PostInput!, $image: Upload, $files : [MediaInput]
  ) {
    createPost(
      postData: $postData, image: $image, files: $files
    ) {
      post {
        ...PostBasicInfosFragment
      }
    }
  }
  ${POST_BASIC_INFOS}
`;

export const PUT_POST = gql`
  mutation UpdatePost(
    $id: ID!
    $postData: PostInput!, $image: Upload, $files : [MediaInput]
  ) {
    updatePost(
      id: $id
      postData: $postData, image: $image, files: $files
    ) {
      post {
        ...PostBasicInfosFragment
      }
    }
  }
  ${POST_BASIC_INFOS}
`;

export const PUT_POST_STATE = gql`
  mutation UpdatePostState($id: ID!) {
    updatePostState(id: $id) {
      done
      success
      message
      post {
        ...PostBasicInfosFragment
      }
    }
  }
  ${POST_BASIC_INFOS}
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      id
      success
      deleted
      message
    }
  }
`;
