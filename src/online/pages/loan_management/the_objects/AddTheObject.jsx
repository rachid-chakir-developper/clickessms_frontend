import * as React from 'react';
import AddTheObjectForm from './AddTheObjectForm';
import { useParams } from 'react-router-dom';

export default function AddTheObject() {
  let { idTheObject } = useParams();
  return (
    <AddTheObjectForm idTheObject={idTheObject} title={(idTheObject && idTheObject > 0) ? `Modifier le objet` : `Ajouter un objet`}/>
  );
}
