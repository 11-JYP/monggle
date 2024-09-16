import { useEffect, useState } from "react";
import { CustomOverlayMap, Map, Polygon } from "react-kakao-maps-sdk";
import useGeoLocationStore from "../zustand/geoLocationStore";
import axios from "axios";

const Home = () => {
  const { geoLocationDataStore, getGeoLocation } = useGeoLocationStore();
  const [polygonPaths, setPolygonPaths] = useState([]);
  const [overlayPositions, setOverlayPositions] = useState([]);
  const [routeNames, setRouteNames] = useState([]);

  useEffect(() => {
    getGeoLocation(); // 페이지에서 위치 정보 가져오기

    const API_URL = `http://localhost:4005/Route`; // 'localhost'로 수정

    const getRouteData = async () => {
      try {
        const response = await axios.get(API_URL);
        const responseRoute = response?.data.map((route) => route.paths);
        const names = response?.data.map((route) => route.routeName);

        if (responseRoute) {
          setPolygonPaths(responseRoute);
        }

        // 각 폴리곤의 첫 번째 경로로 오버레이 위치 설정
        const positions = responseRoute.map((route) => route[0]);
        setOverlayPositions(positions);

        // 각 routeName을 추출하여 상태에 저장
        setRouteNames(names);
        console.log(routeNames);
      } catch (error) {
        console.log("에러 =>", error);
      }
    };

    getRouteData();
  }, [getGeoLocation]);

  return (
    <>
      <Map center={geoLocationDataStore.center} style={{ width: "100%", height: "100vh" }} level={3}>
        {polygonPaths.map((path, index) => (
          <div key={index}>
            <Polygon
              path={path}
              strokeWeight={2}
              strokeColor={"#EE8A2C"}
              strokeOpacity={0.8}
              strokeStyle={"shortdash"}
              fillColor={"#FFDAB6"}
              fillOpacity={0.7}
            />
            {overlayPositions[index] && (
              <CustomOverlayMap
                position={overlayPositions[index]} // 각 폴리곤의 첫 번째 위치에 오버레이 표시
                yAnchor={0.5}
                xAnchor={0.8}
              >
                <div className="w-full h-[30px] p-5 bg-white rounded-full flex items-center justify-center">
                  {routeNames[index]}
                </div>
              </CustomOverlayMap>
            )}
          </div>
        ))}
      </Map>
    </>
  );
};

export default Home;
