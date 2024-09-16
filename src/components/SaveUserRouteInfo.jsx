import React, { useState } from "react";
import userRouteStore from "../zustand/userRouteStore";
import routeDataStore from "../zustand/routeDataStore";
import { createRouteInfo } from "../api/pathDataSave";

const SaveUserRouteInfo = () => {
  // const [routeName, setRouteName] = useState('');
  // const [address, setAddress] = useState('');
  // const [description, setDescription] = useState('');
  // const [selectedPuppy, setSelectedPuppy] = useState('default');

  const routeName = userRouteStore((state) => state.routeName);
  const address = userRouteStore((state) => state.address);
  const description = userRouteStore((state) => state.description);
  const selectedPuppy = userRouteStore((state) => state.selectedPuppy);

  const routeFormData = userRouteStore((state) => state.routeFormData);
  const setUserRouteData = userRouteStore((state) => state.setUserRouteData);
  const routeData = routeDataStore((state) => state.routeData);

  const handleRouteName = (e) => {
    setUserRouteData((prev) => ({ ...prev, routeName: e.target.value }));
  };
  const handleSetAddress = (e) => {
    setUserRouteData((prev) => ({ ...prev, address: e.target.value }));
  };
  const handleDescription = (e) => {
    setUserRouteData((prev) => ({ ...prev, description: e.target.value }));
  };
  const handleSelectPuppy = (e) => {
    setUserRouteData((prev) => ({ ...prev, selectedPuppy: e.target.value }));
  };

  const handleRouteFormSubmit = async (e) => {
    e.preventDefault();
    const userRouteAllDate = {
      ...routeFormData,
      ...routeData
    };

    try {
      await createRouteInfo(userRouteAllDate);
      alert("루트정보저장완료!");
      console.log("루트정보저장완료", userRouteAllDate);
    } catch (error) {
      console.error("루트정보저장에러", error);
    }
  };

  // console.log(selectedPuppy);
  return (
    <form onSubmit={handleRouteFormSubmit}>
      <div className="flex flex-col justify-center items-center gap-10 m-20">
        <div>
          <h1 className="text-orange">나만의 몽글로드 만들기</h1>
        </div>
        <div className="flex flex-col gap-5">
          <input
            value={routeName}
            placeholder="코스명을 입력하세요"
            onChange={handleRouteName}
            className="text-text-color"
          />
          <input value={address} placeholder="주소" onChange={handleSetAddress} />
          <textarea value={description} placeholder="코스를 설명해주세요" onChange={handleDescription} />
          <select value={selectedPuppy} onChange={handleSelectPuppy}>
            <option value="default" disabled>
              이런 강아지에게 추천해요
            </option>
            <option value="smallPuppy">소형견</option>
            <option value="bigPuppy">대형견</option>
          </select>
        </div>
        <div className="bg-slate-100 rounded-xl flex justify-center items-center gap-32">
          <div className="flex flex-col gap-4">
            <p>거리</p>
            <p>1km</p>
          </div>
          <div className="flex flex-col gap-4">
            <p>예상시간</p>
            <p>10분</p>
          </div>
        </div>
      </div>
      <button className="btn">제출</button>
    </form>
  );
};

export default SaveUserRouteInfo;
