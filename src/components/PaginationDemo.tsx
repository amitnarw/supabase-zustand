import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { SelectDemo } from "./SelectDemo";

interface PaginationAttribues {
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
  count: number;
  getAllProduct: () => void;
}

export function PaginationDemo({
  page,
  pageSize,
  setPage,
  setPageSize,
  count,
  getAllProduct,
}: PaginationAttribues) {
  return (
    <Pagination className="flex flex-row items-center justify-between px-2 sm:px-28">
      <div>
        <SelectDemo pageSize={pageSize} setPageSize={setPageSize} />
      </div>
      <PaginationContent>
        {Array.from({ length: Math.ceil(count / pageSize) }).map((_, index) => (
          <PaginationItem key={index}>
            <p
              className={`px-3.5 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 duration-300 ${
                index + 1 === page &&
                "border border-gray-300 dark:border-gray-600"
              }`}
              onClick={() => {
                setPage(index + 1);
                getAllProduct();
              }}
            >
              {index + 1}
            </p>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
