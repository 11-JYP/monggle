import { useState, useRef, useEffect } from "react";
import { Map, Polyline, DrawingManager } from "react-kakao-maps-sdk";
import routeInstance from "../axiosInstance/base"; // axios 인스턴스 불러오기

function WalkCourse() {
  const managerRef = useRef(null);
  const [paths, setPaths] = useState([]);
  const [distance, setDistance] = useState(0);
  const [walkName, setWalkName] = useState("");
  const [walkDescription, setWalkDescription] = useState("");
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);

  const [currentLocation, setCurrentLocation] = useState({ lat: 33.450701, lng: 126.570667 }); // 초기 위치는 임의로 설정
  const [isLocationLoaded, setIsLocationLoaded] = useState(false); // 위치 로딩 상태

  // 사용자의 현재 위치를 가져오는 함수
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setIsLocationLoaded(true);
        },
        (error) => {
          console.error("현재 위치를 가져올 수 없습니다:", error);
          setIsLocationLoaded(true); // 위치를 가져오지 못해도 지도 로딩은 처리
        }
      );
    } else {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      setIsLocationLoaded(true); // 위치를 가져오지 못해도 지도 로딩은 처리
    }
  }, []);

  // 선 그리기 모드 선택 함수
  function selectOverlay() {
    const manager = managerRef.current;
    manager.cancel(); // 그리기 중이던 모든 도형을 취소
    manager.select(kakao.maps.drawing.OverlayType.POLYLINE); // 선 그리기 모드 선택
  }

  // 선 그리기 완료 처리
  const handleDrawComplete = () => {
    const manager = managerRef.current;
    const overlayData = manager.getData();

    if (overlayData.polyline.length > 0) {
      const points = overlayData.polyline[0].points;
      const path = points.map((point) => ({
        lat: point.y,
        lng: point.x
      }));

      // Polyline을 이용한 총 거리 계산
      const calculatedDistance = calculateTotalDistance(path);
      setPaths(path);
      setDistance(calculatedDistance);
      setIsDrawingComplete(true);

      console.log("경로:", path);
      console.log("총 거리:", calculatedDistance);
    }
  };

  // Polyline을 이용한 총 거리 계산 함수
  const calculateTotalDistance = (path) => {
    // 경로가 2개 이상의 점일 경우에만 거리 계산
    if (path.length < 2) return 0;

    // Kakao Polyline 객체 생성
    const polyline = new window.kakao.maps.Polyline({
      path: path.map((point) => new window.kakao.maps.LatLng(point.lat, point.lng))
    });

    // 총 거리 계산 (미터 단위)
    const totalDistance = polyline.getLength();
    return totalDistance;
  };

  // 산책로 데이터를 json-server에 저장하는 함수
  const saveWalkCourse = async () => {
    if (walkName && walkDescription && paths.length > 0) {
      const walkCourse = {
        name: walkName,
        description: walkDescription,
        path: paths,
        distance: Math.round(distance), // m 단위
        estimatedTime: Math.floor(distance / 67) // 분 단위 계산 (67m/분 기준)
      };

      console.log("json에 저장될 데이터:", walkCourse);

      try {
        await routeInstance.post("/routes", walkCourse); // axios 인스턴스를 사용해 데이터 저장
        console.log("json 데이터에 저장:", walkCourse);
        resetDrawing();
      } catch (error) {
        console.error("Error saving walk course:", error);
      }
    } else {
      alert("산책로 이름과 설명을 입력해주세요.");
    }
  };

  // 그리기 후 초기화
  const resetDrawing = () => {
    setPaths([]);
    setDistance(0);
    setWalkName("");
    setWalkDescription("");
    setIsDrawingComplete(false);
  };

  return (
    <div>
      {isLocationLoaded ? (
        <Map
          center={currentLocation} // 현재 위치를 중심으로 설정
          style={{ width: "100%", height: "450px" }}
          level={3}
        >
          <DrawingManager
            ref={managerRef}
            drawingMode={["polyline"]}
            guideTooltip={["draw", "drag", "edit"]}
            polylineOptions={{
              // 선 옵션입니다
              draggable: true, // 그린 후 드래그가 가능하도록 설정합니다
              removable: true, // 그린 후 삭제 할 수 있도록 x 버튼이 표시됩니다
              editable: true, // 그린 후 수정할 수 있도록 설정합니다
              strokeColor: "#39f", // 선 색
              hintStrokeStyle: "dash", // 그리중 마우스를 따라다니는 보조선의 선 스타일
              hintStrokeOpacity: 0.5 // 그리중 마우스를 따라다니는 보조선의 투명도
            }}
          />
          <button onClick={selectOverlay}>선 그리기 시작</button>
          <button onClick={handleDrawComplete}>그리기 완료</button>

          {paths.length > 0 && <Polyline path={paths} strokeWeight={3} strokeColor={"#db4040"} />}

          {isDrawingComplete && (
            <div>
              <h3>산책로 정보 입력</h3>
              <label>산책로 이름: </label>
              <input type="text" value={walkName} onChange={(e) => setWalkName(e.target.value)} />
              <br />
              <label>산책로 설명: </label>
              <textarea value={walkDescription} onChange={(e) => setWalkDescription(e.target.value)} />
              <br />
              <p>총 거리: {Math.round(distance)}m</p>
              <p>예상 산책 시간: {Math.floor(distance / 67)}분</p>
              <button onClick={saveWalkCourse}>추가하기</button>
            </div>
          )}
        </Map>
      ) : (
        <p>현재 위치를 가져오는 중...</p> // 로딩 중일 때 표시할 내용
      )}
    </div>
  );
}

export default WalkCourse;
