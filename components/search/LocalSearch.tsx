"use client";

import React from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {setUrlQuery, remUrlQuery} from "@/lib/url";
import {Input} from "@/components/ui/input";

type LocalSearchProps = {
  route: string;
  image: string;
  placeholder: string;
  className?: string;
};

export function LocalSearch(props: LocalSearchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [value, setValue] = React.useState(query);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (value) {
        const newUrl = setUrlQuery(searchParams.toString(), "query", value);

        router.push(newUrl, {scroll: false});
      } else {
        if (pathname === props.route) {
          const newUrl = remUrlQuery(searchParams.toString(), ["query"]);

          router.push(newUrl, {scroll: false});
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, router, props.route, searchParams, pathname]);

  return (
    <div
      className={cn(
        "background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4",
        props.className,
      )}
    >
      <Image
        src={props.image}
        alt="search"
        width={24}
        height={24}
        className="cursor-pointer"
      />
      <Input
        type="text"
        placeholder={props.placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />
    </div>
  );
}
