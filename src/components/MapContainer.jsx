import { useState } from "react";
import { CustomOverlayMap, Map, Polyline, useKakaoLoader } from "react-kakao-maps-sdk";
import { createRoute } from "../api/makeRoute";

export default function MapContainer() {
  useKakaoLoader();

  const [isdrawing, setIsdrawing] = useState(false);
  const [clickLine, setClickLine] = useState();
  const [paths, setPaths] = useState([]);
  const [distances, setDistances] = useState([]);
  const [mousePosition, setMousePosition] = useState({
    lat: 0,
    lng: 0
  });
  const [moveLine, setMoveLine] = useState();

  // 마우스 클릭
  const handleClick = (_map, mouseEvent) => {
    if (!isdrawing) {
      setDistances([]);
      setPaths([]); // 그리기 전 초기화
    }

    // 경로 추가 시 최신 값 반영
    setPaths((prev) => [
      ...prev,
      {
        lat: mouseEvent.latLng.getLat(),
        lng: mouseEvent.latLng.getLng()
      }
    ]);
    setDistances((prev) => [...prev, Math.round(clickLine.getLength() + moveLine.getLength())]);
    setIsdrawing(true);
    console.log(paths);
  };

  //
  // 마우스 움직임
  const handleMouseMove = (_map, mouseEvent) => {
    setMousePosition({
      lat: mouseEvent.latLng.getLat(),
      lng: mouseEvent.latLng.getLng()
    });
  };

  // 마우스 우클릭
  // 거리정보 인포 제공
  // db 저장
  const handleRightClick = async (_map, _mouseEvent) => {
    setIsdrawing(false);
    const resultRoute = {
      position: paths
    };
    console.log(resultRoute);
    await createRoute(resultRoute);
  };

  // 거리계산 정보칸
  const DistanceInfo = ({ distance }) => {
    const walkkTime = (distance / 67) | 0;
    const bycicleTime = (distance / 227) | 0;

    return (
      <ul className="w-[150px] h-[150px] bg-slate-400">
        <li>
          <div className="pb-4">댕댕길</div>
          <span className="label">총거리</span> <span className="number">{distance}</span>m
        </li>
        <li>
          <span className="label">도보</span>{" "}
          {walkkTime > 60 && (
            <>
              <span className="number">{Math.floor(walkkTime / 60)}</span> 시간{" "}
            </>
          )}
          <span className="number">{walkkTime % 60}</span> 분
        </li>
        <li>
          <span className="label">자전거</span>{" "}
          {bycicleTime > 60 && (
            <>
              <span className="number">{Math.floor(bycicleTime / 60)}</span> 시간{" "}
            </>
          )}
          <span className="number">{bycicleTime % 60}</span> 분
        </li>
      </ul>
    );
  };

  return (
    <>
      {/* <CalculatePolylineDistanceStyle /> */}

      <Map // 지도를 표시할 Container
        id="map"
        center={{
          // 지도의 중심좌표
          lat: 33.450701,
          lng: 126.570667
        }}
        style={{
          // 지도의 크기
          width: "100%",
          height: "100vh"
        }}
        level={3} // 지도의 확대 레벨
        onClick={handleClick}
        onRightClick={handleRightClick}
        onMouseMove={handleMouseMove}
      >
        <Polyline
          path={paths}
          strokeWeight={3} // 선의 두께입니다
          strokeColor={"#db4040"} // 선의 색깔입니다
          strokeOpacity={1} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
          strokeStyle={"solid"} // 선의 스타일입니다
          onCreate={setClickLine}
        />
        {paths.map((path) => (
          <CustomOverlayMap key={`dot-${path.lat},${path.lng}`} position={path} zIndex={1}>
            <span className="dot"></span>
          </CustomOverlayMap>
        ))}
        {paths.length > 1 &&
          distances.slice(1, distances.length).map((distance, index) => (
            <CustomOverlayMap
              key={`distance-${paths[index + 1].lat},${paths[index + 1].lng}`}
              position={paths[index + 1]}
              yAnchor={1}
              zIndex={2}
            >
              {!isdrawing && distances.length === index + 2 ? (
                <DistanceInfo distance={distance} />
              ) : (
                <div className="dotOverlay">
                  거리 <span className="number">{distance}</span>m
                </div>
              )}
            </CustomOverlayMap>
          ))}

        <Polyline
          path={isdrawing ? [paths[paths.length - 1], mousePosition] : []}
          strokeWeight={3} // 선의 두께입니다
          strokeColor={"#db4040"} // 선의 색깔입니다
          strokeOpacity={0.5} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
          strokeStyle={"solid"} // 선의 스타일입니다
          onCreate={setMoveLine}
        />
        {isdrawing && (
          <CustomOverlayMap position={mousePosition} yAnchor={1} zIndex={2}>
            <div className="dotOverlay distanceInfo">
              총거리 <span className="number">{Math.round(clickLine.getLength() + moveLine.getLength())}</span>m
            </div>
          </CustomOverlayMap>
        )}
      </Map>
    </>
  );
}
