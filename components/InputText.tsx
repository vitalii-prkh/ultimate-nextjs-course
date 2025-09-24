import React from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

type InputTextProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "id"
> & {
  label?: string;
  description?: string;
};

export function InputText(props: InputTextProps) {
  const {label, ...rest} = props;

  return (
    <FormItem className="flex w-full flex-col gap-2.5">
      {label && (
        <FormLabel className="paragraph-medium text-dark400_light700">
          {props.label}
          {props.required && <span className="text-primary-500">{" *"}</span>}
        </FormLabel>
      )}
      <FormControl>
        <Input
          {...rest}
          type="text"
          className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border"
        />
      </FormControl>
      {props.description && (
        <FormDescription className="body-regular text-light-500 mt-2.5">
          {props.description}
        </FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
