import { useEffect, useState, useRef } from "react";
import { CustomOverlayMap, Map, DrawingManager } from "react-kakao-maps-sdk";
import routeDataStore from "../zustand/routeDataStore";
import useCurrentLocation from "../hooks/useCurrentLocation";
import loadingImage from "../assets/loadingImage.png";

// 경로 데이터 계산 및 저장 함수
const useRouteData = (paths, distance) => {
  const setRouteData = routeDataStore((state) => state.setRouteData);

  useEffect(() => {
    if (paths.length > 0 && distance > 0) {
      const walkTime = Math.floor(distance / 67);
      const totalDistance = distance;

      setRouteData({
        paths,
        totalDistance, // 총 거리 저장
        totalWalkkTime: walkTime // 계산된 걷는 시간 저장
      });
    }
  }, [paths, distance, setRouteData]);
};

const WalkPath = () => {
  const managerRef = useRef(null);
  const [paths, setPaths] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);
  const setRouteData = routeDataStore((state) => state.setRouteData);

  useEffect(() => {
    // 페이지 로드 시 정보 리셋
    setRouteData({});
  }, [setRouteData]);

  // 선 그리기 모드 선택 함수
  const selectOverlay = () => {
    const manager = managerRef.current;
    manager.cancel(); // 그리기 취소
    manager.select(window.kakao.maps.drawing.OverlayType.POLYLINE);
  };

  useEffect(() => {
    // Esc로 선 그리기 취소
    const handleInfoReset = (e) => {
      const manager = managerRef.current;
      if (e.key === "Escape") {
        setPaths([]);
        setDistance(0);
        setLastPosition(null);
        setIsDrawingComplete(false);
        setRouteData({});

        manager.clear(); // 지도에서 그린 모든 선 제거
        manager.cancel(); // 기존 그리기 취소
        selectOverlay(); // 새로운 그리기 모드 시작
      }
    };
    window.addEventListener("keydown", handleInfoReset);
    return () => {
      window.removeEventListener("keydown", handleInfoReset);
    };
  }, []);

  // 경로 데이터 로직 사용
  useRouteData(paths, distance);

  // 현재 위치 정보 가져오기
  const { location, isLocationLoaded } = useCurrentLocation();

  if (!isLocationLoaded) {
    return (
      <div
        // 이미지 고정값 때문에 이 부분만 style 직접 적용합니다
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          width: "35%",
          height: "100vh",
          marginLeft: "15%"
        }}
      >
        <img src={loadingImage} alt="현재 위치를 불러오는 중..." />
      </div>
    );
  }

  // 그리기 완료 후 경로 데이터 계산 및 저장
  const handleDrawComplete = () => {
    const manager = managerRef.current;
    const overlayData = manager.getData();

    if (overlayData.polyline.length > 0) {
      const points = overlayData.polyline[0].points;
      const path = points.map((point) => ({
        lat: point.y,
        lng: point.x
      }));

      // 거리 계산
      const calculatedDistance = calculateTotalDistance(path);
      setPaths(path);
      setDistance(calculatedDistance);

      // 마지막 좌표 저장
      setLastPosition(path[path.length - 1]);
      setIsDrawingComplete(true);
    }
  };

  // Polyline 총 거리 계산 함수
  const calculateTotalDistance = (path) => {
    if (path.length < 2) return 0;

    const polyline = new window.kakao.maps.Polyline({
      path: path.map((point) => new window.kakao.maps.LatLng(point.lat, point.lng))
    });

    return polyline.getLength();
  };

  // 다시 그리기 함수
  const handleReset = () => {
    setPaths([]);
    setDistance(0);
    setLastPosition(null);
    setIsDrawingComplete(false);
    setRouteData({});

    routeDataStore.setState({
      totalDistance: 0,
      totalWalkkTime: 0
    });

    const manager = managerRef.current;
    manager.clear();
    manager.cancel();
    selectOverlay();
  };

  return (
    <div className="relative w-full h-screen">
      <Map id="map" center={location} style={{ width: "100%", height: "100vh" }} level={3}>
        <DrawingManager
          ref={managerRef}
          drawingMode={["polyline"]}
          guideTooltip={["draw", "drag", "edit"]}
          polylineOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: "#FF7F50",
            hintStrokeStyle: "dash",
            hintStrokeOpacity: 0.5
          }}
        />

        <div>
          <button onClick={selectOverlay} className="drawBtn bottom-[70px] font-Uhbee">
            선 그리기 시작
          </button>
          <button onClick={handleDrawComplete} className="drawBtn bottom-[10px] bg-primary font-Uhbee">
            그리기 완료
          </button>
        </div>

        {isDrawingComplete && lastPosition && (
          <CustomOverlayMap position={lastPosition} yAnchor={1}>
            <DistanceInfo distance={distance} handleReset={handleReset} />
          </CustomOverlayMap>
        )}
      </Map>
    </div>
  );
};

const DistanceInfo = ({ distance, handleReset }) => {
  const displayDistance = `${Math.floor(distance)}m`;

  const walkTime = Math.floor(distance / 67);
  const bycicleTime = Math.floor(distance / 227);

  return (
    <ul className="dotOverlay distanceInfo bg-white rounded-md">
      <li className="mb-2">
        <span className="label font-bold text-gray-600">총 거리</span>
        <span className="number">{displayDistance}</span>
      </li>
      <li className="mb-2">
        <span className="label font-bold text-gray-600">도보</span>
        {walkTime > 60 ? (
          <>
            <span className="number">{Math.floor(walkTime / 60)}</span> 시간{" "}
          </>
        ) : null}
        <span className="number">{walkTime % 60}</span> 분
      </li>
      <li className="mb-2">
        <span className="label font-bold text-gray-600">자전거</span>
        {bycicleTime > 60 ? (
          <>
            <span className="number">{Math.floor(bycicleTime / 60)}</span> 시간{" "}
          </>
        ) : null}
        <span className="number">{bycicleTime % 60}</span> 분
      </li>
      <li>
        <button className="resetBtn" onClick={handleReset}>
          다시 그리기
        </button>
      </li>
    </ul>
  );
};

export default WalkPath;
