import SignInSide from './pages/SignInSide'
import SignUp from './pages/SignUp'

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
  
export default function Offline() {

  return (
    <div className="offline">
      <Routes>
            <Route path={`login`} element={<SignInSide />} />
            <Route path={`register`} element={<SignUp />} />
            <Route
                path="/"
                element={<Navigate to={`login`} replace />}
            />
      </Routes>
    </div>
  );
}
