import { useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/authStore";
import { useEffect } from "react";

const Nav = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      logout();
    }
  };

  // 로그아웃 후 상태가 변경되면 navigate로 홈으로 이동
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/"); // 로그아웃이 완료되면 홈으로 이동
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className=" flex justify-between m-[16px]">
      <div className="flex gap-3">
        <div className="navToggleBtn" onClick={() => navigate("/")}>
          코스
        </div>
        <div className="navToggleBtn" onClick={() => navigate("/search")}>
          검색하기
        </div>
      </div>
      <div>
        <div className="navToggleBtn">마이페이지</div>
      </div>
      <div>
        {isAuthenticated ? (
          <div className="navToggleBtn" onClick={handleLogout}>
            로그아웃
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Nav;
