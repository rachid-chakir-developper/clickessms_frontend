import * as React from 'react';
import AddCallForm from './AddCallForm';
import { useParams } from 'react-router-dom';

export default function AddCall() {
  let { idCall } = useParams();
  return (
    <AddCallForm idCall={idCall} title={(idCall && idCall > 0) ? `Modifier l'appel` : `Ajouter un appel`}/>
  );
}
