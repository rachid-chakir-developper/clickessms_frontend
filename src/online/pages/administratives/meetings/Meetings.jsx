
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListMeetings from "./ListMeetings";
  import AddMeeting from "./AddMeeting";
import MeetingDetails from "./MeetingDetails";
    
  export default function Meetings() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListMeetings />} />
                  <Route path={`ajouter`} element={<AddMeeting />} />
                  <Route path={`modifier/:idMeeting`} element={<AddMeeting />} />
                  <Route path={`details/:idMeeting`} element={<MeetingDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  