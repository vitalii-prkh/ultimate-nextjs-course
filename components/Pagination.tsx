"use client";

import {useRouter, useSearchParams} from "next/navigation";

import {setUrlQuery} from "@/lib/url";
import {cn} from "@/lib/utils";

import {Button} from "./ui/button";

type PaginationProps = {
  page: number | undefined | string;
  isNext: boolean;
  containerClasses?: string;
};

export function Pagination(props: PaginationProps) {
  const {page = 1, isNext, containerClasses} = props;
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (type: "prev" | "next") => {
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const newUrl = setUrlQuery(
      searchParams.toString(),
      "page",
      nextPageNumber.toString(),
    );

    router.push(newUrl);
  };

  return (
    <div
      className={cn(
        "mt-5 flex w-full items-center justify-center gap-2",
        containerClasses,
      )}
    >
      {/* Previous Page Button */}
      {Number(page) > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Button>
      )}

      <div className="bg-primary-500 flex items-center justify-center rounded-md px-3.5 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>

      {/* Next Page Button */}
      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Button>
      )}
    </div>
  );
}
