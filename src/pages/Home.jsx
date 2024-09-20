import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import home from "../assets/home.png";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen flex justify-center items-center flex-col text-center"
    >
      <div>
        <img src={home} alt="home.png" className="w-96 object-contain m-auto" />
      </div>
      <p className="my-10">내가 그려나가는 특별한 산책로</p>
      <Link to="/main" className="btn leading-[60px] hover:bg-orange-500">
        몽글로드
      </Link>
    </motion.div>
  );
};

export default Home;
