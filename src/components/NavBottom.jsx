import useGeoLocationStore from "../zustand/geoLocationStore";

const NavBottom = () => {
  const { getGeoLocation } = useGeoLocationStore();

  const nowLocation = () => {
    console.log("Button clicked, fetching location...");
    getGeoLocation(); // 현재 위치를 가져오는 함수 호출
  };

  return (
    <>
      <div className="flex justify-end m-[16px]">
        <button onClick={nowLocation} className="navToggleBtn">
          현 위치
        </button>
      </div>
    </>
  );
};

export default NavBottom;
