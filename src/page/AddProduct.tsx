import LoadingSmall from "@/components/LoadingSmall";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useStore, { type ProductData } from "@/utils/zustand_store";
import { useState } from "react";
import { useNavigate } from "react-router";

const AddProduct = () => {
  const navigate = useNavigate();
  const {
    showToast,
    isLoadingAddProduct,
    addProduct,
    isLoadingUploadFile,
    uploadFile,
  } = useStore();

  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    brand: "",
    original_price: 0,
    discounted_price: 0,
    image: "",
    quantity: 0,
  });
  const [productImage, setProductImage] = useState<File | null>(null);

  const handleAddProduct = async () => {
    if (
      !productData?.name ||
      !productData?.description ||
      !productData?.brand ||
      !productData?.original_price ||
      !productData?.discounted_price ||
      !productData?.quantity
    ) {
      showToast(
        "Please input name, description, brand, original price, discounted price and quantity",
        "error"
      );
    } else if (!productImage) {
      showToast("Please select an image for this product", "error");
    } else {
      const { publicUrl } = await uploadFile(productImage);
      if (!publicUrl) {
        showToast("Error while uploading image", "error");
      } else {
        const { error: error1 } = await addProduct({
          ...productData,
          image: publicUrl,
        });
        if (error1) {
          showToast("Error while adding product: " + error1?.message, "error");
        } else {
          showToast("Product added successfully", "success");
          navigate("/");
        }
      }
    }
  };

  return (
    <div className="w-full h-full px-10 pb-10">
      <div className="max-w-[800px] min-w-[300px] w-full m-auto">
        <h1 className="font-bold text-3xl">Add Product</h1>
        <div className="text-start flex flex-col gap-5 mt-5">
          <div className="text-start flex flex-col gap-2">
            <Label htmlFor="name" className="text-lg font-normal text-gray-500">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={productData?.name}
              onChange={(e) =>
                setProductData((preVal) => ({
                  ...preVal,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="text-start flex flex-col gap-2">
            <Label
              htmlFor="description"
              className="text-lg font-normal text-gray-500"
            >
              Description
            </Label>
            <Input
              id="description"
              name="description"
              type="text"
              required
              value={productData?.description}
              onChange={(e) =>
                setProductData((preVal) => ({
                  ...preVal,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="text-start flex flex-col gap-2">
            <Label
              htmlFor="brand"
              className="text-lg font-normal text-gray-500"
            >
              Brand
            </Label>
            <Input
              id="brand"
              name="brand"
              type="text"
              required
              value={productData?.brand}
              onChange={(e) =>
                setProductData((preVal) => ({
                  ...preVal,
                  brand: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex flex-row gap-5 w-full">
            <div className="text-start flex flex-col gap-2 w-full">
              <Label
                htmlFor="originalPrice"
                className="text-lg font-normal text-gray-500"
              >
                Original Price
              </Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                required
                value={productData?.original_price}
                onChange={(e) =>
                  setProductData((preVal) => ({
                    ...preVal,
                    original_price: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="text-start flex flex-col gap-2 w-full">
              <Label
                htmlFor="discountedPrice"
                className="text-lg font-normal text-gray-500"
              >
                Discounted Price
              </Label>
              <Input
                id="discountedPrice"
                name="discountedPrice"
                type="number"
                required
                value={productData?.discounted_price}
                onChange={(e) =>
                  setProductData((preVal) => ({
                    ...preVal,
                    discounted_price: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-row gap-5 w-full">
            <div className="text-start flex flex-col gap-2 w-full">
              <Label
                htmlFor="productImage"
                className="text-lg font-normal text-gray-500"
              >
                Select product image
              </Label>
              <Input
                id="productImage"
                name="productImage"
                type="file"
                accept="image/*"
                required
                className="cursor-pointer"
                onChange={(e) => setProductImage(e?.target?.files?.[0] ?? null)}
              />
              <img
                src={
                  productImage
                    ? URL.createObjectURL(productImage)
                    : `/no-image-found.png`
                }
                alt="selected product image"
                className={`rounded-lg bg-gray-100 w-full h-40 object-cover ${
                  !productImage && "opacity-50 dark:opacity-20"
                }`}
              />
            </div>
            <div className="text-start flex flex-col gap-2 w-full">
              <Label
                htmlFor="quantity"
                className="text-lg font-normal text-gray-500"
              >
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                required
                value={productData?.quantity}
                onChange={(e) =>
                  setProductData((preVal) => ({
                    ...preVal,
                    quantity: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          {isLoadingUploadFile ? (
            <div className="flex flex-col gap-2 items-center justify-center">
              <LoadingSmall />
              <p>Uploading image</p>
            </div>
          ) : isLoadingAddProduct ? (
            <div className="flex items-center justify-center">
              <LoadingSmall />
              <p>Adding product data</p>
            </div>
          ) : (
            <Button
              className="mt-4 bg-purple-500 cursor-pointer text-lg py-6"
              onClick={handleAddProduct}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
