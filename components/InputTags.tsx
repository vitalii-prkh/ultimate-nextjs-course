import React from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {InputLabel} from "@/components/InputLabel";
import {CardTag} from "@/components/cards/CardTag";

type InputTextProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "id"
> & {
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  description?: string;
  onKeyDownEnter?: (message?: string | null) => void;
};

export function InputTags(props: InputTextProps) {
  const {
    label,
    required,
    description,
    onChange,
    value,
    onKeyDownEnter,
    ...rest
  } = props;
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key == "Enter") {
        event.preventDefault();

        const tag = event.currentTarget.value.trim();

        if (!tag) {
          return;
        }

        if (tag.length > 15) {
          onKeyDownEnter?.("Tag should be less than 15 characters");

          return;
        }

        if (value.includes(tag)) {
          onKeyDownEnter?.("Tag already exists");

          return;
        }

        onChange([...value, tag]);
        event.currentTarget.value = "";
        onKeyDownEnter?.(null);
      }
    },
    [onChange, onKeyDownEnter, value],
  );

  return (
    <FormItem className="flex w-full flex-col gap-2.5">
      {label && <InputLabel required={required}>{label}</InputLabel>}
      <FormControl>
        <div>
          <Input
            {...rest}
            type="text"
            className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border"
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <div className="flex-start gap=2.5 mt-2.5 flex-wrap">
            {value.map((tag, index) => (
              <CardTag
                key={index}
                _id={tag}
                name={tag}
                onRemove={() => onChange(value.toSpliced(index, 1))}
              />
            ))}
          </div>
        </div>
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
