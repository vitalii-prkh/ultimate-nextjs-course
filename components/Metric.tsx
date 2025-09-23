import Image from "next/image";
import {cn} from "@/lib/utils";

type MetricProps = {
  image: string;
  alt: string;
  value: string | number;
  title: string;
  hideOnMobile?: boolean;
};

export function Metric(props: MetricProps) {
  return (
    <div className="flex-center gap-1">
      <Image
        src={props.image}
        alt={props.alt}
        width={16}
        height={16}
        className="rounded-full object-contain"
      />
      <p className="body-medium text-dark400_light800 flex items-center gap-1">
        {props.value}
        <span
          className={cn("small-regular line-clamp-1", {
            "max-sm:hidden": props.hideOnMobile,
          })}
        >
          {props.title}
        </span>
      </p>
    </div>
  );
}
