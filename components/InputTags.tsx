import React from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {InputLabel} from "@/components/InputLabel";

type InputTextProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "id"
> & {
  label?: string;
  description?: string;
};

export function InputTags(props: InputTextProps) {
  const {label, required, description, ...rest} = props;

  return (
    <FormItem className="flex w-full flex-col gap-2.5">
      {label && <InputLabel required={required}>{label}</InputLabel>}
      <FormControl>
        <Input
          {...rest}
          type="text"
          className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border"
        />
      </FormControl>
      {description && (
        <FormDescription className="body-regular text-light-500 mt-2.5">
          {description}
        </FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}
