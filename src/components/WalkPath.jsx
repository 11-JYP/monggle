import React, { useEffect, useState } from 'react';
import { CustomOverlayMap, Map, Polyline } from 'react-kakao-maps-sdk';
import { createRouteInfo } from '../api/pathDataSave';
import { Route } from 'react-router-dom';
import routeDataStore from '../zustand/routeDataStore';

const WalkPath = () => {
  const [isdrawing, setIsdrawing] = useState(false);
  const [clickLine, setClickLine] = useState({});
  const [paths, setPaths] = useState([]);
  const [distances, setDistances] = useState([]);
  const [mousePosition, setMousePosition] = useState({
    lat: 0,
    lng: 0
  });
  const [moveLine, setMoveLine] = useState();
  // const [routeData, setRouteData] = useState({});

  const setRouteData = routeDataStore((state) => state.setRouteData);
  const routeData = routeDataStore((state) => state.routeData);

  useEffect(() => {
    console.log('거리', distances);
    console.log('루트데이터', routeData);
  }, [distances, routeData]);
  // 키보드 액션
  useEffect(() => {
    // 선 그리기 리셋
    const handleInfoReset = (e) => {
      if (e.key === 'Escape') {
        setIsdrawing(false);
        setPaths([]);
        setDistances([]);
      }
    };
    window.addEventListener('keydown', handleInfoReset);
    return () => {
      window.removeEventListener('keydown', handleInfoReset);
    };
  }, []);

  const handleClick = (_map, mouseEvent) => {
    if (!isdrawing) {
      setDistances([]);
      setPaths([]);
    }
    setPaths((prev) => [
      ...prev,
      {
        lat: mouseEvent.latLng.getLat(),
        lng: mouseEvent.latLng.getLng()
      }
    ]);
    setDistances((prev) => [...prev, Math.round(clickLine.getLength() + moveLine.getLength())]);
    setIsdrawing(true);
    console.log('패스', paths);
  };

  const handleMouseMove = (_map, mouseEvent) => {
    setMousePosition({
      lat: mouseEvent.latLng.getLat(),
      lng: mouseEvent.latLng.getLng()
    });
  };

  const handleRightClick = (_map, _mouseEvent) => {
    setIsdrawing(false);

    // 클릭한 선이 있다면 값들을 저장 => 나중에 저장버튼으로 빼기
    if (clickLine) {
      saveRouteInfo(paths, distances);
    }
  };

  // 경로 저장
  const saveRouteInfo = async (paths, distances) => {
    const totalDistance = distances[distances.length - 1];
    const totalWalkkTime = (totalDistance / 67) | 0;

    // const routeData = {};
    setRouteData({
      paths,
      totalDistance,
      totalWalkkTime
    });
    console.log('루트데이터', setRouteData);

    // try {
    //   await createRouteInfo(routeData);
    //   alert('경로저장완료!');
    //   console.log('경로저장완료', routeData);
    // } catch (error) {
    //   console.error('경로저장에러', error);
    // }
  };

  const DistanceInfo = ({ distance }) => {
    const walkkTime = (distance / 67) | 0;
    const bycicleTime = (distance / 227) | 0;

    return (
      <ul className="dotOverlay distanceInfo">
        <li>
          <span className="label">총거리</span> <span className="number">{distance}</span>m
        </li>
        <li>
          <span className="label">도보</span>{' '}
          {walkkTime > 60 && (
            <>
              <span className="number">{Math.floor(walkkTime / 60)}</span> 시간{' '}
            </>
          )}
          <span className="number">{walkkTime % 60}</span> 분
        </li>
        <li>
          <span className="label">자전거</span>{' '}
          {bycicleTime > 60 && (
            <>
              <span className="number">{Math.floor(bycicleTime / 60)}</span> 시간{' '}
            </>
          )}
          <span className="number">{bycicleTime % 60}</span> 분
        </li>
        <li>
          <button
            style={{
              display: 'inline-block',
              width: '100px',
              height: '50px',
              margin: '10px auto',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              pointerEvents: 'auto',
              zIndex: 50000
            }}
            onClick={() => {
              console.log('Button clicked');
              alert('경로 저장 클릭');
            }}
          >
            경로 저장
          </button>
        </li>
      </ul>
    );
  };

  return (
    <>
      {/* <CalculatePolylineDistanceStyle /> */}
      <Map // 지도를 표시할 Container
        id={`map`}
        center={{
          // 지도의 중심좌표
          lat: 37.498004414546934,
          lng: 127.02770621963765
        }}
        style={{
          // 지도의 크기
          width: '100%',
          height: '100vh'
        }}
        level={3} // 지도의 확대 레벨
        onClick={handleClick}
        onRightClick={handleRightClick}
        onMouseMove={handleMouseMove}
      >
        <Polyline
          path={paths}
          strokeWeight={3} // 선의 두께입니다
          strokeColor={'#db4040'} // 선의 색깔입니다
          strokeOpacity={1} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
          strokeStyle={'solid'} // 선의 스타일입니다
          onCreate={setClickLine}
        />
        {paths.map((path, index) => (
          <CustomOverlayMap key={`dot-${index},${path.lat},${path.lng}`} position={path} zIndex={1}>
            <span className="dot"></span>
          </CustomOverlayMap>
        ))}
        {paths.length > 1 &&
          distances.slice(1, distances.length).map((distance, index) => (
            <CustomOverlayMap
              key={`distance-${index},${paths[index + 1].lat},${paths[index + 1].lng}`}
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
          strokeColor={'#db4040'} // 선의 색깔입니다
          strokeOpacity={0.5} // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
          strokeStyle={'solid'} // 선의 스타일입니다
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
};

export default WalkPath;
