import React from "react";
import {FormLabel} from "@/components/ui/form";

type InputLabelProps = React.PropsWithChildren<{required?: boolean}>;

export function InputLabel(props: InputLabelProps) {
  return (
    <FormLabel className="paragraph-medium text-dark400_light700">
      {props.children}
      {props.required && <span className="text-primary-500">{" *"}</span>}
    </FormLabel>
  );
}
