import { Routes, Route, Navigate } from 'react-router-dom';
import ListMaterials from './ListMaterials';
import AddMaterial from './AddMaterial';

export default function Materials() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListMaterials />} />
        <Route path={`ajouter`} element={<AddMaterial />} />
        <Route path={`modifier/:idMaterial`} element={<AddMaterial />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
