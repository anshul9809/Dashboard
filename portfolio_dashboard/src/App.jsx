import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageSkills from "./pages/ManageSkills";
import ManageTimelines from "./pages/ManageTimelines";
import ManageProjects from "./pages/ManageProjects";
import UpdateProject from "./pages/UpdateProject";
import ViewProject from "./pages/ViewProject";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./store/slices/userSlice";
import { DiscAlbum } from "lucide-react";
import { getAllMessages } from "./store/slices/messageSlice";
import { getAllTimeline } from "./store/slices/timelineSlice";
import { getAllSkills } from "./store/slices/skillSlice";
import { getAllSoftwareApplications } from "./store/slices/softwareApplicationSlice";
import ManageSoftware from "./pages/ManageSoftware";
import { getAllProjects } from "./store/slices/projectSlice";

const App = ()=>{
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getUser());
    dispatch(getAllMessages());
    dispatch(getAllTimeline());
    dispatch(getAllSkills());
    dispatch(getAllSoftwareApplications());
    dispatch(getAllProjects());
  }, []);
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/reset/:token" element={<ResetPassword />} />
        <Route path="/manage/skills" element={<ManageSkills />} />
        <Route path="/manage/timelines" element={<ManageTimelines />} />
        <Route path="/manage/projects" element={<ManageProjects />} />
        <Route path="/update/project/:id" element={<UpdateProject />} />
        <Route path="/view/project/:id" element={<ViewProject />} />
        <Route path="/manage/software" element={<ManageSoftware />} />
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
    </>
  );
}

export default App;