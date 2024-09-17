import userRouteStore from "../zustand/userRouteStore";
import routeDataStore from "../zustand/routeDataStore";
import { createRouteInfo } from "../api/pathDataSave";
import { useNavigate } from "react-router-dom";

const SaveUserRouteInfo = () => {
  const navigate = useNavigate();

  // store에서 객체형태로 불러와서 한번에 넘겨버려
  const { routeName, address, description, selectedPuppy, setUserRouteData } = userRouteStore((state) => ({
    routeName: state.routeFormData.routeName,
    address: state.routeFormData.address,
    description: state.routeFormData.description,
    selectedPuppy: state.routeFormData.selectedPuppy,
    setUserRouteData: state.setUserRouteData
  }));

  const routeData = routeDataStore((state) => state.routeData) || {}; // 초기값을 빈 객체로 설정

  // 입력 값 변경 핸들러들
  const handleRouteName = (e) => {
    setUserRouteData({ routeName: e.target.value });
  };
  const handleSetAddress = (e) => {
    setUserRouteData({ address: e.target.value });
  };
  const handleDescription = (e) => {
    setUserRouteData({ description: e.target.value });
  };
  const handleSelectPuppy = (e) => {
    setUserRouteData({ selectedPuppy: e.target.value });
  };

  // 폼 제출 핸들러
  const handleRouteFormSubmit = async (e) => {
    e.preventDefault();

    // 모든 입력 데이터를 하나로 통합하여 서버에 전송
    const userRouteAllData = {
      routeName,
      address,
      description,
      selectedPuppy,
      ...routeData // routeDataStore에서 가져온 경로 정보 추가
    };

    console.log("제출할 데이터:", userRouteAllData); // 제출 전 확인

    try {
      await createRouteInfo(userRouteAllData);
      alert("루트 정보 저장 완료!");
      navigate("/");
    } catch (error) {
      console.error("루트 정보 저장 에러", error);
    }
  };

  return (
    <form onSubmit={handleRouteFormSubmit}>
      <div className="flex flex-col justify-center items-center gap-10 m-20">
        <div>
          <h1>나만의 몽글로드 만들기</h1>
        </div>
        <div className="flex flex-col gap-5">
          <input value={routeName} placeholder="코스명을 입력하세요" onChange={handleRouteName} style={inputStyle} />
          <input value={address} placeholder="주소" onChange={handleSetAddress} style={inputStyle} />
          <textarea
            value={description}
            placeholder="코스를 설명해주세요"
            onChange={handleDescription}
            maxLength={100}
            style={textAreaStyle}
          />
          <select value={selectedPuppy} onChange={handleSelectPuppy}>
            <option value="default" disabled>
              이런 강아지에게 추천해요
            </option>
            <option value="smallPuppy">소형견</option>
            <option value="bigPuppy">대형견</option>
          </select>
        </div>
        <div className="bg-slate-100 rounded-lg flex justify-center gap-10 py-3 w-full text-sm ">
          <div className="flex flex-col gap-4">
            <p>거리</p>
            <p>{Math.floor(routeData.totalDistance) ? Math.floor(routeData.totalDistance) + " m" : "계산중..."}</p>
          </div>
          <div className="flex flex-col gap-4">
            <p>예상시간</p>
            <p>{routeData.totalWalkkTime ? routeData.totalWalkkTime + " 분" : "계산중..."}</p>
          </div>
        </div>
      </div>
      <div className="p-3 rounded text-white bg-orange-400 text-center w-28 m-auto">
        <button type="submit">코스 생성하기</button>
      </div>
    </form>
  );
};

export default SaveUserRouteInfo;

const inputStyle = {
  border: "1px solid #dddddd",
  padding: "5px 8px",
  fontSize: "14px",
  borderRadius: "2px"
};

const textAreaStyle = {
  border: "1px solid #dddddd",
  padding: "10px 8px",
  minHeight: "100px",
  fontSize: "14px",
  borderRadius: "2px",
  resize: "none"
};
