import { useState } from "react";
import MainPageSide from "../components/MainPageSide";
import MainPageMap from "../components/MainPageMap";

const MainPage = () => {
  const [mapCenter, setMapCenter] = useState(null); // 지도 중심 좌표를 저장

  const updateMapCenter = (center) => {
    setMapCenter(center);
  };

  return (
    <div className="flex">
      <MainPageSide updateMapCenter={updateMapCenter} />
      <MainPageMap center={mapCenter} />
    </div>
  );
};

export default MainPage;
