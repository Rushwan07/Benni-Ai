import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Editor from "./componants/Editor";
import { NotificationProvider } from "./componants/Notification";
import { getMe } from "./feature/Auth/userSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HelpPage from "./pages/Help";

function App() {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/help" element={<HelpPage />} />
          <Route
            path="/editor/:docId"
            element={user?.email ? <Editor /> : <Login />}
          />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
