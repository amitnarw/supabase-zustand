import LoadingSmall from "@/components/LoadingSmall";
import useStore, { type OrdersData } from "@/utils/zustand_store";
import { useEffect, useState } from "react";

const Orders = () => {
  const { showToast, isStateLoading, getAllOrders } = useStore();
  const [orders, setOrders] = useState<null | OrdersData[]>(null);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    const { data, error } = await getAllOrders();
    if (error) {
      showToast(error);
    } else {
      setOrders(data);
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold">ORDERS</h1>
      {isStateLoading ? (
        <LoadingSmall />
      ) : (
        <ul className="flex flex-col gap-4 w-[800px] m-auto mt-5">
          {orders?.map((order) => (
            <li
              key={order?.id}
              className="flex flex-row gap-2 border rounded-xl overflow-hidden text-start w-full"
            >
              <span className="bg-purple-100 p-1 px-8 flex items-center justify-center text-2xl rounded-xl text-purple-600">
                {order?.id}
              </span>
              <div className="p-2 w-full">
                <div className="flex flex-row items-center justify-between w-full">
                  <p>Order id: #{order?.id}</p>

                  <p>
                    <span>Status: </span>
                    <span
                      className={`font-medium ${
                        order?.payments?.[0]?.status === "Completed"
                          ? "text-green-500"
                          : order?.payments?.[0]?.status === "Failed"
                          ? "text-red-500"
                          : "text-purple-500"
                      }`}
                    >
                      {order?.payments?.[0]?.status}
                    </span>
                  </p>
                </div>
                <p>
                  <span>Order data: </span>
                  <span>
                    {new Date(order?.created_at)?.toLocaleDateString()}
                  </span>
                </p>
                <ul className="w-full flex flex-row gap-2">
                  {order?.order_items?.map((order_item) => (
                    <li>
                      <img
                        src={order_item?.image}
                        alt={order_item?.id?.toString()}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
