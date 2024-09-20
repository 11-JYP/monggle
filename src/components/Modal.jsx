import { useEffect, useRef, useState } from "react";
import { getRouteInfo } from "../api/pathDataSave";
import CanvasComponent from "../pages/CanvasComponent";
import html2canvas from "html2canvas";

const Modal = ({ user, onClose }) => {
  const [userRoutes, setUserRoutes] = useState([]); // 사용자 경로 상태
  const refs = useRef([]);
  useEffect(() => {
    const checkUserRoutes = async () => {
      try {
        const savedRoutes = await getRouteInfo(); // 저장된 경로 정보 가져오기

        // 저장된 경로 정보에서 id 비교
        const filteredRoutes = savedRoutes.filter((route) => route.id === user.id);
        setUserRoutes(filteredRoutes); // 사용자 경로 상태 업데이트

        if (filteredRoutes.length > 0) {
          console.log("사용자의 저장된 경로가 있습니다:", filteredRoutes);
        } else {
          console.log("저장된 경로가 없습니다.");
        }
      } catch (error) {
        console.error("경로 정보를 가져오는 데 오류가 발생했습니다:", error);
      }
    };

    checkUserRoutes();
  }, [user.id]); // user.id가 변경될 때마다 실행

  const onClickDownloadButton = (index) => {
    const target = refs.current[index];
    if (!target) {
      return alert("사진 저장에 실패했습니다.");
    }
    html2canvas(target).then((canvas) => {
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.href = canvas.toDataURL("image/png");
      link.download = `${user.nickname}_route_monggle.png`;
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white p-4 rounded w-[800px] h-[500px] px-10">
        <button onClick={onClose} className="flex items-center justify-center ">
          X
        </button>
        <div className="flex flex-col items-center justify-center">
          <h3 className="pt-10 text-[28px]">"{user.nickname}"님 안녕하세요</h3>
        </div>
        <div className="pt-20 text-[18px]">{user.nickname}님께서 그린 몽글로드입니다.</div>
        <div className="pt-10 overflow-x-scroll overflow-y-hidden">
          <div className="flex gap-4 whitespace-nowrap ">
            {userRoutes.length > 0 ? (
              userRoutes.map((route, index) => (
                <div
                  key={route.id}
                  className="relative inline-block cursor-pointer"
                  ref={(el) => (refs.current[index] = el)}
                  onClick={() => onClickDownloadButton(index)}
                >
                  <div className="absolute bottom-0 left-0 p-2 bg-white bg-opacity-70 w-full">
                    <h3 className="pt-1">{route.routeName}</h3>
                    <p>{route.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 hover:opacity-70 transition-opacity flex justify-center items-center">
                    <h1 className="text-lg font-bold">내 몽글로드 다운받기</h1>
                  </div>
                  <div className="bg-[orange]">
                    <CanvasComponent size={200} coordinates={route.paths} />
                  </div>
                </div>
              ))
            ) : (
              <p>저장된 경로가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
