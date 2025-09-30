"use client";

import React from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {remUrlQuery, setUrlQuery} from "@/lib/url";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

type HomeTagsProps = {
  options: ReadonlyArray<{
    label: string;
    value: string;
  }>;
};

export function HomeTags(props: HomeTagsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") || "";
  const [value, setValue] = React.useState(filter);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.currentTarget.id === value) {
      setValue("");

      const newUrl = remUrlQuery(searchParams.toString(), ["filter"]);

      router.push(newUrl, {scroll: false});
    } else {
      setValue(event.currentTarget.id);

      const newUrl = setUrlQuery(
        searchParams.toString(),
        "filter",
        event.currentTarget.id,
      );

      router.push(newUrl, {scroll: false});
    }
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {props?.options?.map((option) => (
        <Button
          key={option.value}
          type="button"
          id={option.value}
          onClick={handleClick}
          className={cn(
            "body-medium rounded-lg px-6 py-3 capitalize shadow-none",
            {
              "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400":
                value === option.value,
              "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300":
                value !== option.value,
            },
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
