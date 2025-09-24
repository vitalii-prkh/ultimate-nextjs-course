import React from "react";
import Link from "next/link";
import Image from "next/image";
import {ROUTES} from "@/refs/routes";
import {buildPath} from "@/lib/path/buildPath";
import {Badge} from "@/components/ui/badge";
import {getDevIconClassName} from "@/lib/utils";

type CardTagProps = {
  _id: string;
  name: string;
  count?: number;
  compact?: boolean;
  onRemove?: () => void;
};

export function CardTag(props: CardTagProps) {
  const isRemove = typeof props.onRemove === "function";
  const content = (
    <React.Fragment>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 flex flex-row gap-2 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${getDevIconClassName(props.name)} text-sm`} />
          <span>{props.name}</span>
        </div>
        {isRemove && (
          <Image
            src="/icons/close.svg"
            alt="close"
            width={12}
            height={12}
            className="cursor-pointer object-contain invert-0 dark:invert"
            onClick={props.onRemove}
          />
        )}
      </Badge>
      {props.count != null && (
        <p className="small-medium text-dark500_light700">{props.count}</p>
      )}
    </React.Fragment>
  );

  if (props.compact) {
    return <button type="button">{content}</button>;
  }

  return (
    <Link
      href={buildPath(ROUTES.TAG_BY_ID, {tagId: props._id})}
      className="flex justify-between gap-2"
    >
      {content}
    </Link>
  );
}
