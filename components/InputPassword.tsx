import React from "react";
import {FormControl, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {InputLabel} from "@/components/InputLabel";

type InputPasswordProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "id"
> & {
  label?: string;
};

export function InputPassword(props: InputPasswordProps) {
  const {label, required, ...rest} = props;

  return (
    <FormItem className="flex w-full flex-col gap-2.5">
      {label && <InputLabel required={required}>{label}</InputLabel>}
      <FormControl>
        <Input
          {...rest}
          type="password"
          className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
