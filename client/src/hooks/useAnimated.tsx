import { useContext } from "react";
import { AnimatedContext } from "../components/Page";

const useAnimated = () => {
  const context = useContext(AnimatedContext);
  if (!context)
    throw new Error("Animated context must be use inside AnimatedProvider");
  return context;
};

export default useAnimated;
