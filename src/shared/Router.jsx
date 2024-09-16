import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Drawing from "../components/Drawing";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/draw" element={<Drawing />} />
        {/* <Route path="myfeed" element={<></>} />
        <Route path="mypage" element={<></>} />
        <Route path="signin" element={<></>} />
        <Route path="signup" element={<></>} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
