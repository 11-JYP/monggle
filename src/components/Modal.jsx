import { useEffect, useRef, useState } from "react";
import { getDeleteRouteInfo, getRouteInfo } from "../api/pathDataSave";
import CanvasComponent from "../pages/CanvasComponent";
import html2canvas from "html2canvas";
import logo from "../assets/logo.png";

const Modal = ({ user, onClose, onRouteDeleted }) => {
  const [userRoutes, setUserRoutes] = useState([]); // 사용자 경로 상태
  const refs = useRef([]);

  useEffect(() => {
    const checkUserRoutes = async () => {
      try {
        const savedRoutes = await getRouteInfo(); // 저장된 경로 정보 가져오기

        // 저장된 경로 정보에서 id 비교
        const filteredRoutes = savedRoutes.filter((route) => route.userId === user.id);
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
  }, [user.id]);

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

  const handleDelete = async (routeId) => {
    try {
      await getDeleteRouteInfo(routeId);
      setUserRoutes((prevRoutes) => {
        const updatedRoutes = prevRoutes.filter((route) => route.id !== routeId);
        alert("몽글로드가 삭제되었습니다.");
        return updatedRoutes;
      });
      onRouteDeleted();
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 실패");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-Uhbee">
      <div className="relative bg-white py-4 px-10 rounded w-[800px] h-[500px] ">
        <button
          onClick={onClose}
          className="absolute top-[-20px] right-[-15px] border-4 bg-white border-secondary-200 shadow-md w-14 h-14 rounded-full"
        >
          X
        </button>
        <div className="flex flex-col items-center justify-center">
          <h3 className="pt-10 text-[28px]">
            <span className="text-secondary-200"> &quot; {user.nickname} &quot;</span> 님 안녕하세요!
          </h3>
        </div>
        <div className="pt-12 text-[18px] text-center">{user.nickname}님께서 그린 몽글로드입니다.</div>
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
                  <button
                    className="absolute top-0 right-0 text-[12px] mb-2 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(route.id);
                    }}
                  >
                    삭제
                  </button>
                  <div className="absolute bottom-0 left-0 p-2 bg-white opacity-80 w-full font-sans leading-5 ">
                    <h3 className="pb-1 font-extrabold">{route.routeName}</h3>
                    <p className="pb-1 text-sm">{route.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-secondary-100 opacity-0 hover:opacity-70 transition-opacity flex justify-center items-center">
                    <div className="flex flex-col text-lg">
                      <img src={logo} alt="logo.png" className="w-16 m-auto" />내 몽글로드 다운받기
                    </div>
                  </div>
                  <div className="bg-secondary-100">
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
