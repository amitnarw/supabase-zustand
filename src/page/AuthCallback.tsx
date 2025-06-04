import LoadingSmall from "@/components/LoadingSmall";

const AuthCallback = () => {
  return (
    <div className="h-full w-full mt-20 flex flex-col gap-5 items-center justify-center">
      <LoadingSmall />
      <p>Checking user, please don't refresh or close this window</p>
    </div>
  );
};

export default AuthCallback;
