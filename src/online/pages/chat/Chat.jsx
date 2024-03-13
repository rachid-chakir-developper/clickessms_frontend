
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListChat from "./ListChat";
import Conversation from "./conversation/Conversation";
    
  export default function Chat() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListChat />} />
                  <Route path={`liste`} element={<ListChat />} />
                  <Route path={`conversation/:chatId`} element={<Conversation />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  