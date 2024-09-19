import { BrowserRouter, Route, Routes } from "react-router-dom";
import WalkPathPage from "../pages/WalkPathPage";
import MainPage from "../pages/MainPage";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
import Category from "../components/SearchContent";
import Search from "../pages/Search";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/walkpath" element={<WalkPathPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
