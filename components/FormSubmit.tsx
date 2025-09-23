import React from "react";
import {Button} from "@/components/ui/button";

type FormSubmitProps = Omit<React.ComponentProps<typeof Button>, "className">;

export function FormSubmit(props: FormSubmitProps) {
  return (
    <Button
      type="submit"
      disabled={props.disabled}
      className="primary-gradient paragraph-medium rounded-2 font-inter !text-light-900 min-h-12 w-full px-4 py-3"
    >
      {props.children}
    </Button>
  );
}
