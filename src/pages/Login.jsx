import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import useAuthStore from "../zustand/authStore";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (formData) => {
    await login(formData);
    navigate("/walkpath");
  };

  return (
    <div className="w-full flex mt-28 flex-col justify-center align-middle items-center text-center">
      <h1 className="text-3xl font-extrabold">로그인</h1>
      <div className="flex flex-col">
        <AuthForm mode="login" onSubmit={handleLogin} />
      </div>
      <div className="mt-10">
        <p className="text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="font-semibold  hover:text-primary hover:border-b-2 ml-2">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
