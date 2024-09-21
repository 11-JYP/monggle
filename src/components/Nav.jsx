import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/authStore";
import { useEffect } from "react";

import Modal from "./Modal";

const Nav = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();
  const { isAuthenticated, logout, user } = useAuthStore();

  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      logout();
      navigate("/");
    }
  };

  // 로그아웃 후 상태가 변경되면 navigate로 홈으로 이동
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/main"); // 로그아웃이 완료되면 홈으로 이동
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <div className=" flex justify-between m-[16px] font-Uhbee">
        <div className="flex gap-3">
          <div className="navToggleBtn" onClick={() => navigate("/main")}>
            코스
          </div>
          <div className="navToggleBtn" onClick={() => navigate("/search")}>
            검색하기
          </div>
        </div>
        <div>
          {isAuthenticated ? (
            <>
              <div className="flex gap-2">
                <div>
                  <div className="navToggleBtn" onClick={() => setModalOpen(true)}>
                    마이페이지
                  </div>
                </div>
                <div className="navToggleBtn" onClick={handleLogout}>
                  로그아웃
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="navToggleBtn" onClick={() => navigate("/login")}>
                로그인
              </div>
            </>
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          className="w-full h-full fixed top-0 left-0 flex justify-center items-center bg-black bg-opacity-50"
          ref={modalBackground}
          onClick={(e) => {
            if (e.target === modalBackground.current) {
              setModalOpen(false);
            }
          }}
        >
          <Modal user={user} onClose={() => setModalOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Nav;
