import { useEffect, useState } from "react";
import { getRouteInfo } from "../api/pathDataSave";

const Modal = ({ user, onClose }) => {
  const [userRoutes, setUserRoutes] = useState([]); // 사용자 경로 상태

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white p-4 rounded w-[600px] h-[500px]">
        <button onClick={onClose} className="flex items-center justify-center ">
          X
        </button>
        <div className="flex flex-col items-center justify-center">
          <h3 className="pt-5 text-[24px]">{user.nickname}님 안녕하세요</h3>
        </div>
        <div className="pt-10">{user.id}님께서 그린 몽글로드입니다.</div>
        <>
          <div>
            {userRoutes.length > 0 ? (
              <ul>
                {userRoutes.map((route) => (
                  <li key={route.id}>
                    <h3>{route.routeName}</h3>
                    <p>주소: {route.address}</p>
                    <p>설명: {route.description}</p>
                    <p>추천 강아지: {route.selectedPuppy}</p>
                    {/* 필요한 다른 정보도 추가 가능 */}
                  </li>
                ))}
              </ul>
            ) : (
              <p>저장된 경로가 없습니다.</p>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export default Modal;
