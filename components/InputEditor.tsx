import React from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Editor} from "@/components/editor";

type InputEditorProps = Omit<
  React.ComponentProps<typeof Editor>,
  "type" | "id" | "editorRef"
> & {
  required?: boolean;
  placeholder?: string;
  label?: string;
  description?: string;
};

export function InputEditor(props: InputEditorProps) {
  const {label, required, description, ...rest} = props;

  return (
    <FormItem className="flex w-full flex-col gap-2.5">
      {label && (
        <FormLabel className="paragraph-medium text-dark400_light700">
          {label}
          {required && <span className="text-primary-500">{" *"}</span>}
        </FormLabel>
      )}
      <FormControl>
        <Editor {...rest} />
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
