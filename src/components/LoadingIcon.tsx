import { Loader } from "lucide-react";

const LoadingIcon = () => {
  return (
    <div className="absolute bg-black/40 inset-0 z-1000 flex items-center justify-center h-screen">
      <Loader className="animate-spin w-12 h-12 text-white" />
    </div>
  );
};

export default LoadingIcon;
