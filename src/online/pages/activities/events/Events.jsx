
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListEvents from "./ListEvents";
  import AddEvent from "./AddEvent";
import EventDetails from "./EventDetails";
    
  export default function Events() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListEvents />} />
                  <Route path={`ajouter`} element={<AddEvent />} />
                  <Route path={`modifier/:idEvent`} element={<AddEvent />} />
                  <Route path={`details/:idEvent`} element={<EventDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  