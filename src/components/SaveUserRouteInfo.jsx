import userRouteStore from "../zustand/userRouteStore";
import routeDataStore from "../zustand/routeDataStore";
import { createRouteInfo } from "../api/pathDataSave";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/authStore";
import { useEffect, useRef, useState } from "react";
import Home from "../assets/home.png";
const SaveUserRouteInfo = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const routeNameRef = useRef(null);
  const addressRef = useRef(null);
  const descriptionRef = useRef(null);

  const [clickedPuppy, setClickedPuppy] = useState("smallPuppy");
  const [isColorClicked, setIsColorClicked] = useState(false);
  const selectColor = ["#FF7F50", "#50d0ff", "#ffd750", "#ff5079", "#BCEE68"];

  // store에서 객체형태로 불러와서 한번에 넘겨버려
  const { routeName, address, description, selectedPuppy, selectedLineColor, setUserRouteData } = userRouteStore(
    (state) => ({
      routeName: state.routeFormData.routeName,
      address: state.routeFormData.address,
      description: state.routeFormData.description,
      selectedPuppy: state.routeFormData.selectedPuppy,
      selectedLineColor: state.routeFormData.selectedLineColor,
      setUserRouteData: state.setUserRouteData
    })
  );

  const routeData = routeDataStore((state) => state.routeData) || {}; // 초기값을 빈 객체로 설정

  // 입력 값 변경 핸들러
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserRouteData({ [name]: value });
  };

  // 강아지 선택
  const handleSelectPuppy = (e) => {
    const value = e.target.value;
    setClickedPuppy(value);
    setUserRouteData({ selectedPuppy: value });
  };

  // 색상 선택
  const handleSelectColor = (e) => {
    const value = e.target.value;
    setIsColorClicked(value);
    setUserRouteData({ selectedLineColor: value });
  };

  // 폼 제출 핸들러
  const handleRouteFormSubmit = async (e) => {
    e.preventDefault();

    // 모든 입력 데이터를 하나로 통합하여 서버에 전송
    const userRouteAllData = {
      id: user.id,
      nickname: user.nickname,
      routeName,
      address,
      description,
      selectedPuppy,
      selectedLineColor,
      ...routeData // routeDataStore에서 가져온 경로 정보 추가
    };

    if (Object.keys(routeData).length === 0) {
      alert("루트를 그려주세요");
      return;
    }

    if (!routeName) {
      alert("루트 이름을 입력해주세요.");
      routeNameRef.current.focus();
      return;
    }

    if (!address) {
      alert("주소를 입력해주세요.");
      addressRef.current.focus();
      return;
    }

    if (!description) {
      alert("설명을 입력해주세요.");
      descriptionRef.current.focus();
      return;
    }

    console.log("제출할 데이터:", userRouteAllData); // 제출 전 확인

    try {
      await createRouteInfo(userRouteAllData);
      alert("루트 정보 저장 완료!");
      setUserRouteData({
        routeName: "",
        address: "",
        description: "",
        selectedPuppy: "smallPuppy",
        selectedLineColor: "#FF7F50"
      });
      navigate("/main");
    } catch (error) {
      console.error("루트 정보 저장 에러", error);
    }
  };

  return (
    <form onSubmit={handleRouteFormSubmit}>
      <div className="sideContainer">
        <div className="flex flex-col justify-center items-center gap-6 m-[20px]">
          <div className="w-20 py-4">
            <img src={Home} alt="Home" />
          </div>
          <div>
            <h1 className="font-bold text-secondary-200 text-2xl pt-4 px-4 mb-2 font-Uhbee">나만의 몽글로드 만들기</h1>
          </div>
          <div className="flex flex-col gap-3 w-full justify-between">
            <input
              value={routeName}
              name="routeName"
              placeholder="코스명을 입력하세요"
              onChange={handleInputChange}
              className="input w-full"
              ref={routeNameRef}
            />
            <input
              value={address}
              name="address"
              placeholder="주소"
              onChange={handleInputChange}
              className="input w-full"
              ref={addressRef}
            />
            <textarea
              value={description}
              name="description"
              placeholder="코스를 설명해주세요"
              onChange={handleInputChange}
              className="input w-full min-h-20"
              maxLength={100}
              ref={descriptionRef}
            />
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              value="smallPuppy"
              className={`puppyBtn ${clickedPuppy === "smallPuppy" ? "bg-primary" : "bg-gray-400"}`}
              onClick={handleSelectPuppy}
            >
              소형견
            </button>
            <button
              type="button"
              value="bigPuppy"
              className={`puppyBtn ${clickedPuppy === "bigPuppy" ? "bg-primary" : "bg-gray-400"}`}
              onClick={handleSelectPuppy}
            >
              대형견
            </button>
          </div>
          <div>
            <hi className="flex justify-center font-bold">선 색상선택 (디폴트 : 오렌지)</hi>
            <span className="flex justify-center text-sm text-gray-500 gap-4 mt-2 "> * 그리기 완료 후 반영됩니다</span>
            <div className="flex justify-center gap-4 mt-5 min-h-8">
              {selectColor.map((lineColor) => (
                <button
                  key={lineColor}
                  value={lineColor}
                  type="button"
                  style={{
                    backgroundColor: lineColor,
                    border: isColorClicked === lineColor ? `3px ${lineColor + "80"} solid` : "none"
                  }}
                  className="p-3 rounded  w-5  m-auto"
                  onClick={handleSelectColor}
                ></button>
              ))}
            </div>
          </div>
          <div className="bg-slate-100 rounded-lg flex justify-center gap-10 py-3 w-3/4 text-sm ">
            <div className="flex flex-col gap-4">
              <p className="font-bold">거리</p>
              <p>{Math.floor(routeData.totalDistance) ? Math.floor(routeData.totalDistance) + " m" : "계산중..."}</p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-bold">예상시간</p>
              <p>{routeData.totalWalkkTime ? routeData.totalWalkkTime + " 분" : "계산중..."}</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-[40px] bg-primary rounded-full text-white hover:bg-secondary-200 transition-all"
          >
            코스 생성하기
          </button>
        </div>
      </div>
    </form>
  );
};

export default SaveUserRouteInfo;

// const textAreaStyle = {
//   border: "1px solid #dddddd",
//   padding: "10px 8px",
//   minHeight: "100px",
//   fontSize: "14px",
//   borderRadius: "2px",
//   resize: "none"
// };
