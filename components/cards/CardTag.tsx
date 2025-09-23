import Link from "next/link";
import {ROUTES} from "@/refs/routes";
import {buildPath} from "@/lib/path/buildPath";
import {Badge} from "@/components/ui/badge";
import {getDevIconClassName} from "@/lib/utils";

type CardTagProps = {
  _id: string;
  name: string;
  count?: number;
  compact?: boolean;
};

export function CardTag(props: CardTagProps) {
  return (
    <Link
      href={buildPath(ROUTES.TAG_BY_ID, {tagId: props._id})}
      className="flex justify-between gap-2"
    >
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${getDevIconClassName(props.name)} text-sm`} />
          <span>{props.name}</span>
        </div>
      </Badge>
      {props.count != null && (
        <p className="small-medium text-dark500_light700">{props.count}</p>
      )}
    </Link>
  );
}
