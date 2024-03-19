import * as React from 'react';
import AddEmployeeForm from './AddEmployeeForm';
import { useParams } from 'react-router-dom';

export default function AddEmployee() {
  let { idEmployee } = useParams();
  return (
    <AddEmployeeForm idEmployee={idEmployee} title={(idEmployee && idEmployee > 0) ? `Modifier l'employé` : `Ajouter un employé`}/>
  );
}
