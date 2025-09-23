import React from "react";

export function FormLayout(props: React.ComponentProps<"form">) {
  const {children, ...rest} = props;

  return (
    <form
      {...rest}
      className="mt-10 space-y-6"
    >
      {children}
    </form>
  );
}
