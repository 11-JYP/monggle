import React, { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const { kakao } = window;

const KEYWORD_LIST = [
  { id: 1, value: '애견카페' },
  { id: 2, value: '동물병원' },
  { id: 3, value: '애견호텔' }
];

const Category = () => {
  // 기본 위치 상태
  const [state, setState] = useState({
    center: {
      lat: 33.450701,
      lng: 126.570667
    },
    errMsg: null,
    isLoading: true
  });
  const [search, setSearch] = useState([]);

  const searchPlaces = (category) => {
    if (!state.center) return;
    const ps = new kakao.maps.services.Places();

    const options = {
      location: new kakao.maps.LatLng(state.center.lat, state.center.lng),
      radius: 5000,
      sort: kakao.maps.services.SortBy.DISTANCE
    };
    console.log(options);

    ps.keywordSearch(
      category,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          setSearch(data); // 검색 결과를 search 상태에 저장
        } else {
          console.error('검색에 실패하였습니다.');
        }
      },
      options
    );
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            isLoading: false
          }));
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false
          }));
        }
      );
    } else {
      setState((prev) => ({
        ...prev,
        errMsg: 'geolocation을 사용할수 없어요..',
        isLoading: false
      }));
    }
  }, []);

  console.log(state);
  return (
    <Map center={state.center} style={{ width: '100%', height: 'calc(100vh - 109px)', marginTop: '48px' }} level={3}>
      <MapMarker position={state.center} />
      {search.map((data) => (
        <MapMarker
          key={data.id}
          position={{ lat: data.y, lng: data.x }}
          onClick={() => {
            if (data.id === openMarkerId) {
              setOpenMarkerId(null);
            } else {
              setOpenMarkerId(data.id);
              moveLatLng(data);
            }
          }}
        />
      ))}
      {KEYWORD_LIST.map((keyword) => (
        <button key={keyword.id} onClick={() => searchPlaces(keyword.value)}>
          {keyword.value}
        </button>
      ))}
    </Map>
  );
};

export default Category;
