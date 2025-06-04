import LoadingIcon from "@/components/LoadingIcon";
import LoadingSmall from "@/components/LoadingSmall";
import useStore, { type CartItems } from "@/utils/zustand_store";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const Cart = () => {
  const {
    showToast,
    isGetCartLoading,
    cartData,
    getCart,
    changeQuantity,
    isCheckoutLoading,
    handleCheckout,
    addToCartLoading,
  } = useStore();
  const [summary, setSummary] = useState({
    totalItems: 0,
    subtotalPrice: 0,
    shippingFee: 0,
    totalPrice: 0,
  });
  const [cart, setCart] = useState<{
    data: CartItems[] | null;
    count: number | null;
    error: any;
  }>();

  useEffect(() => {
    getAllCartItems();
  }, []);

  const getAllCartItems = async () => {
    const resp = cartData?.data ? cartData : await getCart();
    setCart(resp);
    let price = resp?.data?.reduce((total: number, item) => {
      return (total =
        total +
        item?.quantity *
          (item?.products?.discounted_price
            ? item?.products?.discounted_price
            : item?.products?.original_price));
    }, 0);
    setSummary({
      totalItems: resp?.count || 0,
      subtotalPrice: price || 0,
      shippingFee: 0,
      totalPrice: price || 0,
    });
  };

  const handleCheckoutFunction = async () => {
    const structuredData = cart?.data?.map((product) => ({
      name: product?.products?.name,
      image: product?.products?.image,
      description: product?.products?.description,
      brand: product?.products?.brand,
      price: product?.products?.discounted_price
        ? product?.products?.discounted_price
        : product?.products?.original_price,
      quantity: product?.quantity,
      product_id: product?.product_id,
    }));

    let { data, error } = await handleCheckout(
      structuredData,
      summary?.totalPrice
    );

    if (error) {
      showToast(error?.message);
    } else {
      window.location.href = data?.url;
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8 w-11/12 lg:w-8/12 m-auto">
        <div className="flex flex-col gap-5 mt-2 w-full lg:w-4/6">
          <h1 className="font-bold text-4xl text-start">CART</h1>
          <ul className="flex flex-col gap-2 items-center">
            {!cart?.data || (cart?.count && cart?.count < 1) ? (
              <p className="text-gray-500 text-start text-xl w-full">
                Cart is Empty
              </p>
            ) : isGetCartLoading ? (
              <div className="w-full flex items-center justify-center">
                <LoadingSmall />;
              </div>
            ) : (
              cart?.data?.map((product) => (
                <li
                  key={product?.id}
                  className="flex flex-col sm:flex-row gap-2 w-full border rounded-xl overflow-hidden p-2 h-auto sm:h-36"
                >
                  <img
                    src={product?.products?.image}
                    alt={product?.products?.name}
                    className="w-full sm:w-40 h-44 sm:h-full object-cover rounded-lg"
                  />
                  <div className="p-2 flex flex-col h-full w-full">
                    <div className="w-full text-start h-full">
                      <h3 className="font-bold text-lg">
                        {product?.products?.brand}
                      </h3>
                      <p className="text-md text-gray-500 mb-2 line-clamp-2">
                        {product?.products?.name}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">
                          {product?.products?.discounted_price?.toLocaleString(
                            "en-IN",
                            {
                              style: "currency",
                              currency: "INR",
                            }
                          )}
                        </span>
                        <span className="line-through text-sm text-gray-400">
                          {product?.products?.original_price?.toLocaleString(
                            "en-IN",
                            {
                              style: "currency",
                              currency: "INR",
                            }
                          )}
                        </span>
                        <span className="text-green-600 text-sm">
                          {(
                            ((product?.products?.original_price -
                              product?.products?.discounted_price) /
                              product?.products?.original_price) *
                            100
                          ).toFixed(1)}
                          % off
                        </span>
                      </div>
                      {addToCartLoading ? (
                        <LoadingSmall w={5} h={5} />
                      ) : (
                        <div className="flex items-center text-sm">
                          <button
                            className="px-1 py-1 rounded-full bg-purple-500 dark:bg-purple-700 text-white cursor-pointer hover:bg-purple-700 duration-300"
                            onClick={() =>
                              changeQuantity(
                                product?.product_id,
                                product?.quantity - 1
                              )
                            }
                          >
                            <Minus size={18} />
                          </button>
                          <span className="text-black dark:text-white mx-2 text-sm font-medium">
                            {product?.quantity}
                          </span>
                          <button
                            className="px-1 py-1 rounded-full bg-purple-500 dark:bg-purple-700 text-white cursor-pointer hover:bg-purple-700 duration-300"
                            onClick={() =>
                              changeQuantity(
                                product?.product_id,
                                product?.quantity + 1
                              )
                            }
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        {cart?.count && cart?.count > 0 && (
          <div className="flex flex-col text-start lg:mt-16 w-full lg:w-2/6 mb-16">
            <h1 className="font-bold text-2xl mb-2">Summary</h1>
            <p className="flex flex-row items-center justify-between mb-1">
              <span className="text-gray-500">Items: </span>
              <span>{summary?.totalItems}</span>
            </p>
            <p className="flex flex-row items-center justify-between mb-1">
              <span className="text-gray-500">Subtotal amount: </span>
              <span>
                {summary?.subtotalPrice?.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            </p>
            <p className="flex flex-row items-center justify-between mb-1">
              <span className="text-gray-500">Shipping: </span>
              <span className="text-green-500">
                {summary?.shippingFee === 0
                  ? "Free"
                  : `₹${summary?.shippingFee?.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}`}
              </span>
            </p>
            <hr className="my-4" />
            <p className="flex flex-row items-center justify-between">
              <span className="font-medium text-xl">Total amount: </span>
              <span className="font-bold text-2xl">
                {summary.totalPrice?.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            </p>
            {isCheckoutLoading ? (
              <LoadingIcon />
            ) : (
              <button
                className="w-full text-white dark:text-black bg-black dark:bg-white hover:bg-purple-600 dark:hover:bg-purple-600 dark:hover:text-white duration-300 cursor-pointer p-2 mt-5"
                onClick={handleCheckoutFunction}
              >
                Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
