import { create } from "zustand";
import { persist } from "zustand/middleware";
import { register, login as loginAPI } from "../api/auth";

const useAuthStore = create(
  persist(
    (set) => ({
      user: { id: "", nickname: "" }, // 초기값을 객체로 설정
      token: null,
      isAuthenticated: false,

      // 로그인 함수
      login: async (formData) => {
        try {
          const response = await loginAPI({
            id: formData.userId,
            password: formData.password
          });

          if (response.accessToken) {
            set({
              token: response.accessToken,
              user: {
                id: response.userId, // 서버 응답에서 유저 데이터 설정
                nickname: response.nickname // 서버 응답에서 닉네임 설정
              },
              isAuthenticated: true
            });
          } else {
            alert("로그인에 실패했습니다.");
          }
        } catch (error) {
          console.error("로그인 실패:", error);
          alert("로그인에 실패했습니다. 다시 시도해주세요.");
        }
      },
      // 회원가입 함수
      signup: async (formData) => {
        try {
          const response = await register({
            id: formData.userId,
            password: formData.password,
            nickname: formData.nickname
          });

          if (response.success) {
            alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
          } else {
            alert("회원가입에 실패했습니다.");
          }
        } catch (error) {
          console.error("회원가입 실패:", error);
          alert("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
      },

      // 로그아웃 함수
      logout: () => {
        set({ user: { id: "", nickname: "" }, token: null, isAuthenticated: false });
      }
    }),
    {
      name: "auth-storage"
    }
  )
);

export default useAuthStore;
