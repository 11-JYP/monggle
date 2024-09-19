import { useState, useEffect } from "react";

const useCurrentLocation = () => {
  const [location, setLocation] = useState({ lat: 33.450701, lng: 126.570667 }); // 기본 위치 설정
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  // 위치 정보 가져오는 함수 로직
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setIsLocationLoaded(true);
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          setIsLocationLoaded(true);
        }
      );
    } else {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      setIsLocationLoaded(true);
    }
  };

  useEffect(() => {
    fetchLocation(); // 커스텀 훅 내부에서 위치 정보를 가져옴
  }, []);

  return { location, isLocationLoaded };
};

export default useCurrentLocation;
