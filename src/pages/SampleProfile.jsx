import React, { useEffect } from "react";
import useAuthStore from "../zustand/authStore";
import { getRouteInfo } from "../api/pathDataSave";

const SampleProfile = () => {
  const { user } = useAuthStore();

  console.log(user); // 여기서 user가 어떻게 보이는지 확인

  useEffect(() => {
    const checkUserRoutes = async () => {
      try {
        const savedRoutes = await getRouteInfo(); // 저장된 경로 정보 가져오기

        // 저장된 경로 정보에서 id 비교
        const userRoutes = savedRoutes.filter((route) => route.id === user.id);

        if (userRoutes.length > 0) {
          console.log("사용자의 저장된 경로가 있습니다:", userRoutes);
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
    <div>
      <h1>사용자 정보</h1>
      <p>아이디: {user.id}</p>
      <p>닉네임: {user.nickname}</p>
    </div>
  );
};

export default SampleProfile;
