import { Loader } from "lucide-react";

const LoadingSmall = ({ w, h }: { w?: number; h?: number }) => {
  return (
    <Loader
      className={`animate-spin ${w ? `w-${w}` : "w-12"} ${
        h ? `h-${h}` : "h-12"
      } text-black dark:text-white`}
    />
  );
};

export default LoadingSmall;
