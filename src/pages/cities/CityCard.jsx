import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CityCard({ name, description, colors, Icon, route }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(route)}
      className={`
        flex flex-col items-center justify-center 
        p-6 rounded-2xl cursor-pointer text-white 
        transition-all duration-300 h-full 
        ${colors}
        bg-opacity-80 backdrop-blur-xl 
        shadow-lg hover:shadow-2xl hover:shadow-indigo-500/40
        border border-white/20
      `}
    >
      <Icon className="w-14 h-14 mb-4 opacity-90 drop-shadow-lg" />
      <h2 className="text-2xl font-bold drop-shadow-md">{name}</h2>
      <p className="text-sm mt-2 opacity-90 text-center">{description}</p>
    </motion.div>
  );
}
