import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef();

  return (
    <>
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
          <button className="navToggleBtn" onClick={() => setModalOpen(true)}>
            마이페이지
          </button>
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
          <div className="bg-white w-[500px] h-[600px] p-[20px]">
            <button className={"modal-close-btn"} onClick={() => setModalOpen(false)}>
              X
            </button>
            <p>마이페이지입니다</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
