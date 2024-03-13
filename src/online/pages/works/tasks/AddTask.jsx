import * as React from 'react';
import AddTaskForm from './AddTaskForm';
import { useParams } from 'react-router-dom';

export default function AddTask() {
  let { idTask } = useParams();
  return (
    <AddTaskForm idTask={idTask} title={(idTask && idTask > 0) ? `Modifier l'intervention` : `Ajouter une intervention`}/>
  );
}
