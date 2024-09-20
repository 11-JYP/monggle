import AuthForm from "../components/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../zustand/authStore";

const Signup = () => {
  const signup = useAuthStore((state) => state.signup);
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    await signup(formData);
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen flex  flex-col justify-center align-middle items-center text-center font-Uhbee">
      <h1 className="text-3xl font-extrabold mb-5">회원가입</h1>
      <AuthForm mode="signup" onSubmit={handleSignup} />
      <div className="mt-10">
        <p className="text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="font-semibold hover:text-primary hover:border-b-2 ml-2">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
