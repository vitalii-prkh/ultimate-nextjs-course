"use client";

import React from "react";
import Image from "next/image";
import {useForm, SubmitHandler} from "react-hook-form";
import {Loader} from "lucide-react";
import {ReloadIcon} from "@radix-ui/react-icons";
import {z} from "zod";
import {standardSchemaResolver} from "@hookform/resolvers/standard-schema";
import {schemaAnswer} from "@/lib/validations";
import {Button} from "@/components/ui/button";
import {Form, FormField} from "@/components/ui/form";
import {InputEditor} from "@/components/InputEditor";
import {FormSubmit} from "@/components/FormSubmit";

type FormAnswerValues = z.infer<typeof schemaAnswer>;

export function FormAnswer() {
  const [isAISubmitting, setAISubmitting] = React.useState(false);
  const form = useForm<FormAnswerValues>({
    defaultValues: {
      content: "",
    },
    resolver: standardSchemaResolver(schemaAnswer),
  });
  const handleSubmit: SubmitHandler<FormAnswerValues> = async (values) => {};

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-6 flex w-full flex-col gap-10"
      >
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <h4 className="paragraph-semibold text-dark400_light800">
            Write your answer here
          </h4>
          <Button
            disabled={isAISubmitting}
            type="button"
            className="btn light-border-2 text-primart-500 dark:text-primary-500 gap-1.5 rounded-md border px-4 py-2.5 shadow-none"
          >
            {isAISubmitting && (
              <React.Fragment>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                Generating...
              </React.Fragment>
            )}
            {!isAISubmitting && (
              <React.Fragment>
                <Image
                  src="/icons/stars.svg"
                  alt="Generate AI Answer"
                  width={12}
                  height={12}
                  className="object-contain"
                />
                Generate AI Answer
              </React.Fragment>
            )}
          </Button>
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({field}) => (
            <InputEditor
              {...field}
              required
              label="Detailed explanation of your problem"
              placeholder="Explanation of your problem"
              description="Introduce the problem and expand on what you are put in the title."
            />
          )}
        />
        <div className="flex justify-end">
          <FormSubmit disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <React.Fragment>
                <Loader className="mr-2 size-4 animate-spin" />
                Submitting...
              </React.Fragment>
            )}
            {!form.formState.isSubmitting && "Submit"}
          </FormSubmit>
        </div>
      </form>
    </Form>
  );
}
