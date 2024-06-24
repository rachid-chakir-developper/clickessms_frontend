import { Routes, Route, Navigate } from 'react-router-dom';
import ListTransmissionEvents from './ListTransmissionEvents';
import AddTransmissionEvent from './AddTransmissionEvent';
import TransmissionEventDetails from './TransmissionEventDetails';

export default function TransmissionEvents() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListTransmissionEvents />} />
        <Route path={`ajouter`} element={<AddTransmissionEvent />} />
        <Route path={`modifier/:idTransmissionEvent`} element={<AddTransmissionEvent />} />
        <Route path={`details/:idTransmissionEvent`} element={<TransmissionEventDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
