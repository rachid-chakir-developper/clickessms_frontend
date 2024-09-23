import * as React from 'react';
import AddPostForm from './AddPostForm';
import { useParams } from 'react-router-dom';

export default function AddPost() {
  let { idPost } = useParams();
  return (
    <AddPostForm
      idPost={idPost}
      title={
        idPost && idPost > 0
          ? `Modifier le message`
          : `Ajouter un article`
      }
    />
  );
}
