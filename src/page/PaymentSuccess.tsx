import LoadingSmall from "@/components/LoadingSmall";
import useStore from "@/utils/zustand_store";
import { CircleCheckBig, CircleX } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const {
    showToast,
    paymentStatus,
    handleCheckStatus,
    unsubscribePaymentChannel,
    checkPaymentStatusDatabase,
  } = useStore();
  const [databaseStatus, setDatabaseStatus] = useState<null | string>(null);

  const session_id = searchParams.get("session_id");
  useEffect(() => {
    if (session_id) {
      getPaymentStatusFromDatabase(session_id);
    }
  }, [session_id]);

  useEffect(() => {
    if (databaseStatus === "Pending" && session_id) {
      handleCheckStatus(session_id);

      return () => {
        unsubscribePaymentChannel();
      };
    }
  }, [databaseStatus]);

  let getPaymentStatusFromDatabase = async (session_id: string) => {
    const { data, error } = await checkPaymentStatusDatabase(session_id);
    if (error) {
      showToast(error, "error");
    } else {
      setDatabaseStatus(data?.[0]?.status);
    }
  };

  return (
    <div className="flex flex-col">
      {databaseStatus === "Completed" ||
      databaseStatus === "Failed" ||
      paymentStatus === "Completed" ||
      paymentStatus === "Failed" ? (
        databaseStatus === "Completed" || paymentStatus === "Completed" ? (
          <div className="flex flex-col gap-5 items-center justify-center mt-20">
            <CircleCheckBig color="green" size={60} />
            <p className="text-green-500 text-4xl">PAYMENT SUCCESSFUL</p>
            <Link
              className="mt-2 px-10 py-2 bg-purple-500 hover:bg-purple-600 duration-300 text-white"
              to={"/"}
            >
              Home
            </Link>
          </div>
        ) : databaseStatus === "Failed" || paymentStatus === "Failed" ? (
          <div className="flex flex-col gap-5 items-center justify-center mt-20">
            <CircleX color="red" size={60} />
            <p className="text-red-500 text-4xl">PAYMENT FAILED</p>
            <Link
              className="mt-2 px-10 py-2 bg-purple-500 hover:bg-purple-600 duration-300 text-white"
              to={"/"}
            >
              Home
            </Link>
          </div>
        ) : (
          ""
        )
      ) : (
        <div className="flex flex-col gap-5 items-center justify-center mt-20">
          <LoadingSmall />
          <p className="text-black text-2xl">
            Please do not close this window or press back while we confirm your
            payment status
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
