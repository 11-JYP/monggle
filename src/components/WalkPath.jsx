import { useEffect, useState, useRef } from "react";
import { CustomOverlayMap, Map, DrawingManager } from "react-kakao-maps-sdk";
import routeDataStore from "../zustand/routeDataStore";
import useCurrentLocation from "../hooks/useCurrentLocation";
import loadingImage from "../assets/loadingImage.png";

const WalkPath = () => {
  const managerRef = useRef(null);
  const [paths, setPaths] = useState([]);
  const [distance, setDistance] = useState(0);
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);
  const [lastPosition, setLastPosition] = useState(null);

  // 경로 데이터 계산 및 저장 함수
  const setRouteData = routeDataStore((state) => state.setRouteData);

  useEffect(() => {
    if (paths.length > 0 && distance > 0) {
      const walkTime = Math.floor(distance / 67);
      const totalDistance = distance;

      setRouteData({
        paths,
        totalDistance,
        totalWalkkTime: walkTime
      });
      console.log("루트 데이터 저장 완료:", paths, totalDistance, walkTime);
    }
  }, [paths, distance, setRouteData]);

  // 현재 위치 정보 가져오기
  const { location, isLocationLoaded } = useCurrentLocation();

  if (!isLocationLoaded) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "40%", height: "100vh" }}>
        <img src={loadingImage} alt="현재 위치를 불러오는 중..." />
      </div>
    );
  }

  // 선 그리기 모드 선택 함수
  const selectOverlay = () => {
    const manager = managerRef.current;
    manager.cancel(); // 그리기 취소
    manager.select(window.kakao.maps.drawing.OverlayType.POLYLINE);
  };

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

    routeDataStore.setState({
      totalDistance: 0,
      totalWalkkTime: 0
    });

    const manager = managerRef.current;
    manager.clear(); // 지도에서 그린 모든 선 제거
    manager.cancel(); // 기존 그리기 취소
    selectOverlay(); // 새로운 그리기 모드 시작
  };

  return (
    <>
      <Map id="map" center={location} style={{ width: "100%", height: "100vh" }} level={3}>
        <DrawingManager
          ref={managerRef}
          drawingMode={["polyline"]}
          guideTooltip={["draw", "drag", "edit"]}
          polylineOptions={{
            draggable: true,
            removable: true,
            editable: true,
            strokeColor: "#39f",
            hintStrokeStyle: "dash",
            hintStrokeOpacity: 0.5
          }}
        />

        <div>
          <button onClick={selectOverlay} style={buttonStyle}>
            선 그리기 시작
          </button>
          <button onClick={handleDrawComplete} style={completeButtonStyle}>
            그리기 완료
          </button>
        </div>

        {isDrawingComplete && lastPosition && (
          <CustomOverlayMap position={lastPosition} yAnchor={1}>
            <DistanceInfo distance={distance} handleReset={handleReset} />
          </CustomOverlayMap>
        )}
      </Map>
    </>
  );
};

const DistanceInfo = ({ distance, handleReset }) => {
  const displayDistance = `${Math.floor(distance)}m`;

  const walkTime = Math.floor(distance / 67);
  const bycicleTime = Math.floor(distance / 227);

  return (
    <ul className="dotOverlay distanceInfo" style={overlayStyle}>
      <li>
        <span className="label">총 거리</span> <span className="number">{displayDistance}</span>
      </li>
      <li>
        <span className="label">도보</span>
        {walkTime > 60 ? (
          <>
            <span className="number">{Math.floor(walkTime / 60)}</span> 시간{" "}
          </>
        ) : null}
        <span className="number">{walkTime % 60}</span> 분
      </li>
      <li>
        <span className="label">자전거</span>
        {bycicleTime > 60 ? (
          <>
            <span className="number">{Math.floor(bycicleTime / 60)}</span> 시간{" "}
          </>
        ) : null}
        <span className="number">{bycicleTime % 60}</span> 분
      </li>
      <li>
        <button style={resetButtonStyle} onClick={handleReset}>
          다시 그리기
        </button>
      </li>
    </ul>
  );
};

// 스타일 부분 객체로 분리 -> 테일윈드 작업 필요!
const buttonStyle = {
  position: "absolute",
  bottom: "70px",
  right: "10px",
  zIndex: "10",
  display: "inline-block",
  width: "100px",
  height: "40px",
  margin: "10px auto",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const completeButtonStyle = {
  ...buttonStyle,
  bottom: "10px",
  backgroundColor: "#ff9672"
};

const resetButtonStyle = {
  display: "inline-block",
  width: "100px",
  height: "50px",
  margin: "10px auto",
  backgroundColor: "#ff5c5c",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const overlayStyle = {
  backgroundColor: "white",
  padding: "10px"
};

export default WalkPath;