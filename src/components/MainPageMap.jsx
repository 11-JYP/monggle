import { useEffect, useState } from "react";
import { CustomOverlayMap, Map, Polygon } from "react-kakao-maps-sdk";
import useGeoLocationStore from "../zustand/geoLocationStore";
import axios from "axios";
import Nav from "./Nav";
import NavBottom from "./NavBottom";

const MainPageMap = ({ center }) => {
  const { geoLocationDataStore, getGeoLocation, setGeoLocation } = useGeoLocationStore();
  const [polygonPaths, setPolygonPaths] = useState([]);
  const [overlayPositions, setOverlayPositions] = useState([]);
  const [routeNames, setRouteNames] = useState([]);
  const [selectedLineColor, setSelectedLineColor] = useState([]);

  useEffect(() => {
    getGeoLocation();

    const API_URL = `http://localhost:4005/Route`;

    const getRouteData = async () => {
      try {
        const response = await axios.get(API_URL);
        const responseRoute = response?.data.map((route) => route.paths);
        const names = response?.data.map((route) => route.routeName);
        const lineColor = response?.data.map((route) => route.selectedLineColor);

        if (responseRoute) {
          setPolygonPaths(responseRoute);
        }

        // 각 폴리곤의 첫 번째 경로로 오버레이 위치 설정
        const positions = responseRoute.map((route) => route[0]);
        setOverlayPositions(positions);

        // 각 routeName을 추출하여 상태에 저장
        setRouteNames(names);

        // 선 색 저장
        setSelectedLineColor(lineColor);
      } catch (error) {
        console.log("에러 =>", error);
      }
    };

    getRouteData();
  }, [getGeoLocation]);

  const handleMapDragEnd = (map) => {
    const lat = map.getCenter().getLat();
    const lng = map.getCenter().getLng();

    setGeoLocation({ lat, lng });
  };

  return (
    <>
      <div className="relative w-full h-screen">
        <Map
          center={center || geoLocationDataStore.center}
          style={{ width: "100%", height: "100vh" }}
          level={3}
          onDragEnd={handleMapDragEnd}
        >
          <div className="absolute top-0 left-0 z-10 p-4 w-full">
            <Nav className="w-full" />
          </div>

          <div className="absolute bottom-0 right-0 z-10 p-4 w-full">
            <NavBottom className="w-full" />
          </div>
          {polygonPaths.map((path, index) => (
            <div key={index}>
              <Polygon
                path={path}
                strokeWeight={2}
                strokeColor={selectedLineColor[index] ? selectedLineColor[index] : "#FF7F50"}
                strokeOpacity={0.8}
                strokeStyle={"shortdash"}
                fillColor={selectedLineColor[index] ? selectedLineColor[index] + "80" : "#FF7F5080"}
                fillOpacity={0.7}
              />
              {overlayPositions[index] && (
                <CustomOverlayMap position={overlayPositions[index]} yAnchor={0.5} xAnchor={0.5}>
                  <div className="w-full h-[30px] p-5 bg-white text-lg text-secondary-200 font-bold border-2 border-solid border-primary rounded-full flex items-center justify-center font-Uhbee">
                    {routeNames[index]}
                  </div>
                </CustomOverlayMap>
              )}
            </div>
          ))}
        </Map>
      </div>
    </>
  );
};

export default MainPageMap;
