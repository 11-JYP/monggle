import useGeoLocationStore from "../zustand/geoLocationStore";
import targetImg from "../assets/target-icon.png"; // 상대 경로로 이미지 import

const NavBottom = () => {
  const { getGeoLocation } = useGeoLocationStore();

  const nowLocation = () => {
    getGeoLocation();
  };

  return (
    <>
      <div className="flex justify-end m-[16px]">
        <button
          onClick={nowLocation}
          className="w-[50px] h-[50px] bg-white rounded-full p-[10px] shadow hover:bg-secondary-200 transition duration-200 ease-in-out flex justify-center items-center"
        >
          <img src={targetImg} alt="target" className="w-full h-full" />
        </button>
      </div>
    </>
  );
};

export default NavBottom;
