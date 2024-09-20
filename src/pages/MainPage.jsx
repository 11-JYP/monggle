import { useState } from "react";
import MainPageSide from "../components/MainPageSide"; // 가정: MainPageSide 컴포넌트 import
import MainPageMap from "../components/MainPageMap";

const MainPage = () => {
  const [mapCenter, setMapCenter] = useState(null); // 지도 중심 좌표를 저장

  const updateMapCenter = (center) => {
    setMapCenter(center);
  };

  return (
    <div className="flex " style={{ width: "100%", height: "100vh" }}>
      <MainPageSide updateMapCenter={updateMapCenter} />
      <MainPageMap center={mapCenter} />
    </div>
  );
};

export default MainPage;
