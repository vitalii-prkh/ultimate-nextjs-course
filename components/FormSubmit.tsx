import React from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

type FormSubmitProps = Omit<
  React.ComponentProps<typeof Button>,
  "className"
> & {
  fullWidth?: boolean;
};

export function FormSubmit(props: FormSubmitProps) {
  return (
    <Button
      type="submit"
      disabled={props.disabled}
      className={cn(
        "primary-gradient paragraph-medium rounded-2 font-inter !text-light-900 min-h-12 px-4 py-3",
        {
          "w-full": props.fullWidth,
        },
      )}
    >
      {props.children}
    </Button>
  );
}
