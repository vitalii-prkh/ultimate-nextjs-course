import React from "react";
import Image from "next/image";
import Link from "next/link";
import {DEFAULT_EMPTY, DEFAULT_ERROR} from "@/refs/states";
import {Button} from "@/components/ui/button";

type DataRendererProps<T> = {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty?: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
};

export function DataRenderer<T>(props: DataRendererProps<T>) {
  if (!props.success) {
    const {error} = props;

    return (
      <StateSkeleton
        image={{
          light: "/images/light-error.png",
          dark: "/images/dark-error.png",
          alt: "Error state illustration",
        }}
        title={error?.message || DEFAULT_ERROR.message}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : DEFAULT_ERROR.message
        }
        button={DEFAULT_ERROR.button}
      />
    );
  }

  if (!props.data || !props.data.length) {
    const {empty = DEFAULT_EMPTY} = props;

    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "Empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  return <div>{props.render(props.data)}</div>;
}

type StateSkeletonProps = {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
};

function StateSkeleton(props: StateSkeletonProps) {
  return (
    <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
      <Image
        src={props.image.dark}
        alt={props.image.alt}
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />
      <Image
        src={props.image.light}
        alt={props.image.alt}
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8">{props.title}</h2>
      <p className="body-regular text-dark500_light700 max-md my-3.5 text-center">
        {props.message}
      </p>
      {props.button && (
        <Link href={props.button.href}>
          <Button className="paragraph-medium bg-primary-500 text-light-900 hover:bg-primary-500 mt-5 min-h-[46px] rounded-lg px-4 py-3">
            {props.button.text}
          </Button>
        </Link>
      )}
    </div>
  );
}
