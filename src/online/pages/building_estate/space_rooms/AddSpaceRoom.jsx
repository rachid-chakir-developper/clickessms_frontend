import * as React from 'react';
import AddSpaceRoomForm from './AddSpaceRoomForm';
import { useParams } from 'react-router-dom';

export default function AddSpaceRoom() {
  let { idSpaceRoom } = useParams();
  return (
    <AddSpaceRoomForm
      idSpaceRoom={idSpaceRoom}
      title={
        idSpaceRoom && idSpaceRoom > 0
          ? `Modifier la salle`
          : `Ajouter une salle`
      }
    />
  );
}
