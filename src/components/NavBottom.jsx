import useGeoLocationStore from "../zustand/geoLocationStore";

const NavBottom = () => {
  const { getGeoLocation } = useGeoLocationStore();

  const nowLocation = () => {
    getGeoLocation();
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
