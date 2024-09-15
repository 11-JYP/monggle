import { useState } from "react";

const AuthForm = ({ mode, onSubmit }) => {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    nickname: mode === "signup" ? "" : null
  });

  const handleChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    setFormData({
      ...formData,
      [inputName]: inputValue
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col pt-4 justify-center align-middle items-center ">
      <input
        type="text"
        name="userId"
        value={formData.userId}
        onChange={handleChange}
        placeholder="아이디"
        required
        className="w-56 p-3 m-3 border border-gray-300 rounded-lg"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="비밀번호"
        minLength="4"
        required
        className="w-56 p-3 m-3 border border-gray-300 rounded-lg"
      />
      {mode === "signup" && (
        <input
          type="text"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          placeholder="닉네임"
          required
          className="w-56 p-3 m-3  border border-gray-300 rounded-lg"
        />
      )}
      <button
        type="submit"
        className="w-40 bg-primary hover:bg-secondary-100 text-white font-bold py-3 mt-5 rounded-full"
      >
        {mode === "login" ? "로그인" : "회원가입"}
      </button>
    </form>
  );
};

export default AuthForm;
