import { BrowserRouter, Route, Routes } from "react-router-dom";
// import WalkCourse from "../components/WalkCourse";
import WalkPathPage from "../pages/WalkPathPage";
import SaveUserRouteInfo from "../components/saveUserRouteInfo";
import MainPage from "../pages/MainPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/walkpath" element={<WalkPathPage />} />
        <Route path="/saveuserroute" element={<SaveUserRouteInfo />} />
        <Route path="signin" element={<></>} />
        <Route path="signup" element={<></>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
