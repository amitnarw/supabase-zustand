import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDemo({
  pageSize,
  setPageSize,
}: {
  pageSize: number;
  setPageSize: (pageSize: number) => void;
}) {
  return (
    <Select onValueChange={(value) => setPageSize(Number(value))}>
      <SelectTrigger>
        <SelectValue placeholder={pageSize} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="6">6</SelectItem>
          <SelectItem value="9">9</SelectItem>
          <SelectItem value="12">12</SelectItem>
          <SelectItem value="15">15</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
