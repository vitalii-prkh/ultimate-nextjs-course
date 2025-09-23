import React from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

type InputPasswordProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "id"
> & {
  label?: string;
};

export function InputPassword(props: InputPasswordProps) {
  const id = React.useId();
  const {label, ...rest} = props;

  return (
    <FormItem className="flex w-full flex-col gap-2.5">
      {label && (
        <FormLabel
          htmlFor={id}
          className="paragraph-medium text-dark400_light700"
        >
          {props.label}
        </FormLabel>
      )}
      <FormControl>
        <Input
          {...rest}
          id={id}
          type="password"
          className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
