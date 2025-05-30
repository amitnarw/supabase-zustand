import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
    <Pagination>
      <PaginationContent>
        {Array.from({ length: Math.ceil(count / pageSize) }).map((_, index) => (
          <PaginationItem key={index}>
            <p
              className={`px-3.5 py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 duration-300 ${
                index + 1 === page && "border"
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
