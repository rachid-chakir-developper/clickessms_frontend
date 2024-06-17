import { Routes, Route, Navigate } from 'react-router-dom';
import ListTickets from './ListTickets';
import AddTicket from './AddTicket';
import TicketDetails from './TicketDetails';

export default function Tickets() {
  return (
    <div className="online">
      <Routes>
        <Route path={`liste`} element={<ListTickets />} />
        <Route path={`ajouter`} element={<AddTicket />} />
        <Route path={`modifier/:idTicket`} element={<AddTicket />} />
        <Route path={`details/:idTicket`} element={<TicketDetails />} />
        <Route path="/" element={<Navigate to={`liste`} replace />} />
      </Routes>
    </div>
  );
}
