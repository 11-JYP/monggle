import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../pages/MainPage";
import WalkPathPage from "../pages/WalkPathPage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Search from "../pages/Search";

import ProtectedRoute from "../components/ProtectedRoute";
import SampleProfile from "../pages/SampleProfile";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/walkpath" element={<ProtectedRoute element={WalkPathPage} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sample" element={<SampleProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
