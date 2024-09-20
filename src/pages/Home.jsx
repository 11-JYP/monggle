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
      <Link to="/main" className="mb-16">
        <img src={home} alt="home.png" className="w-96 object-contain m-auto" />
      </Link>
      <h1 className="text-secondary-200 text-xl">로고를 클릭해주세요!</h1>
    </motion.div>
  );
};

export default Home;
