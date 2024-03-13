
import {
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
  import ListTasks from "./ListTasks";
  import AddTask from "./AddTask";
import TaskDetails from "./TaskDetails";
    
  export default function Tasks() {
  
    return (
      <div className="online">
          <Routes>
                  <Route path={`liste`} element={<ListTasks />} />
                  <Route path={`ajouter`} element={<AddTask />} />
                  <Route path={`modifier/:idTask`} element={<AddTask />} />
                  <Route path={`details/:idTask`} element={<TaskDetails />} />
                  <Route
                      path="/"
                      element={<Navigate to={`liste`} replace />}
                  />
          </Routes>
      </div>
    );
  }
  