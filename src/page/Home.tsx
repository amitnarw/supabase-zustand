import { PaginationDemo } from "@/components/PaginaionDemo";
import { SkeletonCard } from "@/components/SkeletonCard";
import useStore from "@/utils/zustand_store";
import { Heart } from "lucide-react";
import { useEffect } from "react";

const Home = () => {
  const {
    isStateLoading,
    productList,
    getAllProduct,
    page,
    pageSize,
    setPage,
    setPageSize,
    count,
  } = useStore();

  useEffect(() => {
    if (productList?.length === 0) {
      getAllProduct();
    }
  }, [getAllProduct, productList]);

  return (
    <div className="bg-white dark:bg-black">
      {isStateLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {Array.from({ length: 6 }).map((item) => (
            <SkeletonCard />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 p-4 justify-center h-full">
          {productList?.map((item, index) => (
            <div
              key={index}
              className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden relative hover:shadow-2xl transition w-full sm:w-[40%] md:w-[28%] group transform hover:scale-102 cursor-pointer"
            >
              {item?.discounted_price && (
                <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded z-10">
                  Discount
                </div>
              )}
              <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 z-10">
                <Heart size={20} />
              </button>
              <img
                src={item?.image}
                alt={item?.name}
                className="w-full h-60 object-cover z-1 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-2 flex flex-col text-start justify-between h-full">
                <div>
                  <h3 className="font-bold text-lg">{item?.brand}</h3>
                  <p className="text-md text-gray-500 mb-2">{item?.name}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">
                      ₹{item?.original_price}
                    </span>
                    <span className="line-through text-sm text-gray-400">
                      ₹{item?.discounted_price}
                    </span>
                    <span className="text-green-600 text-sm">
                      {(
                        ((item?.original_price - item?.discounted_price) /
                          item?.original_price) *
                        100
                      ).toFixed(1)}
                      % off
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="bg-green-600 text-white text-xs px-1.5 rounded mr-1">
                      {item?.avg_rating} ★
                    </span>
                    <span className="text-gray-500 text-xs">22</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!isStateLoading && (
        <div className="py-5">
          <PaginationDemo
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            count={count}
            getAllProduct={getAllProduct}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
