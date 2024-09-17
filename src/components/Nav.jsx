import React from "react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  return (
    <div className=" flex justify-between m-[16px]">
      <div className="flex gap-3">
        <div className="navToggleBtn" onClick={navigate("/")}>
          코스
        </div>
        <div className="navToggleBtn">애견카페</div>
        <div className="navToggleBtn">동물병원</div>
        <div className="navToggleBtn">애견호텔</div>
      </div>
      <div>
        <div className="navToggleBtn">마이페이지</div>
      </div>
    </div>
  );
};

export default Nav;
