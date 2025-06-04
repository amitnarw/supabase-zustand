import LoadingSmall from "@/components/LoadingSmall";
import useStore, { type OrdersData } from "@/utils/zustand_store";
import { useEffect, useState } from "react";

const Orders = () => {
  const { showToast, isAllOrdersLoading, getAllOrders } = useStore();
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
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-4xl font-bold">ORDERS</h1>
      {isAllOrdersLoading ? (
        <div className="flex items-center justify-center mt-20 w-full">
          <LoadingSmall />
        </div>
      ) : !orders || orders?.length < 1 ? (
        <p className="mt-5 text-gray-500 text-xl">No order found</p>
      ) : (
        <ul className="flex flex-col items-center justify-center gap-4 w-full mt-5 px-5">
          {orders?.map((order) => (
            <li
              key={order?.id}
              className="flex flex-row gap-2 border rounded-xl overflow-hidden text-start pr-2 mx-5 min-w-[300px] max-w-[800px] w-full"
            >
              <p className="bg-purple-100 dark:bg-purple-500/20 p-1 px-4 sm:px-8 flex items-center justify-center rounded-xl text-purple-600 flex flex-col">
                <span className="font-bold text-2xl">
                  {new Date(order?.created_at)?.getDate()?.toLocaleString()}
                </span>
                <span className="font-medium text-xl">
                  {new Date(order?.created_at)?.toLocaleString("default", {
                    month: "long",
                  })}
                </span>
                <span>
                  {new Date(order?.created_at)?.getFullYear()?.toLocaleString()}
                </span>
              </p>
              <div className="p-2 w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                  <p>
                    <span>Order id: </span>
                    <span className="font-medium">#{order?.id}</span>
                  </p>
                  <p>
                    <span>Payment: </span>
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

                <ul className="w-full flex flex-row gap-2 mt-2 items-center">
                  {order?.order_items?.map((order_item) => (
                    <li key={order_item?.id}>
                      <img
                        src={order_item?.image}
                        alt={order_item?.id?.toString()}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    </li>
                  ))}
                  <span className="text-gray-500 line-clamp-1 ml-1 text-sm">
                    {order?.order_items?.length}{" "}
                    {order?.order_items?.length > 1 ? "items" : "item"}
                  </span>
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
