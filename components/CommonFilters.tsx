"use client";

import {useRouter, useSearchParams} from "next/navigation";

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from "@/components/ui/select";
import {setUrlQuery} from "@/lib/url";
import {cn} from "@/lib/utils";

type CommonFiltersProps = {
  filters: ReadonlyArray<Filter>;
  otherClasses?: string;
  containerClasses?: string;
};
type Filter = {
  label: string;
  value: string;
};

export function CommonFilters(props: CommonFiltersProps) {
  const {filters, otherClasses = "", containerClasses = ""} = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsFilter = searchParams.get("filter");
  const handleUpdateParams = (value: string) => {
    const newUrl = setUrlQuery(searchParams.toString(), "filter", value);

    router.push(newUrl, {scroll: false});
  };

  return (
    <div className={cn("relative", containerClasses)}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramsFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            "body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5",
            otherClasses,
          )}
          aria-label="Filter options"
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
