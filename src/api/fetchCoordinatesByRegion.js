const fetchCoordinatesByRegion = (regionName) => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps.services) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(regionName, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const { x: lng, y: lat } = result[0].address;
          resolve({ lat: parseFloat(lat), lng: parseFloat(lng) });
        } else {
          reject(new Error("지역을 찾을 수 없습니다."));
        }
      });
    } else {
      reject(new Error("카카오 지도 API를 사용할 수 없습니다."));
    }
  });
};
export default fetchCoordinatesByRegion;
