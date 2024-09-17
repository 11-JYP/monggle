import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
// import WalkCourse from "../components/WalkCourse";
import WalkPathPage from "../pages/WalkPathPage";
import SaveUserRouteInfo from "../components/saveUserRouteInfo";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/walkpath" element={<WalkPathPage />} />
        <Route path="/saveuserroute" element={<SaveUserRouteInfo />} />
        <Route path="signin" element={<></>} />
        <Route path="signup" element={<></>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
