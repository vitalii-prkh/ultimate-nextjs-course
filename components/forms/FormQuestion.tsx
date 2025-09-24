"use client";

import {useForm} from "react-hook-form";
import {z} from "zod";
import {standardSchemaResolver} from "@hookform/resolvers/standard-schema";
import {schemaAskQuestion} from "@/lib/validations";
import {Form, FormField} from "@/components/ui/form";
import {InputText} from "@/components/InputText";
import {FormSubmit} from "@/components/FormSubmit";

type FormAskQuestionValues = z.infer<typeof schemaAskQuestion>;

export function FormQuestion() {
  const form = useForm<FormAskQuestionValues>({
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
    resolver: standardSchemaResolver(schemaAskQuestion),
  });
  const handleSubmit = (values: FormAskQuestionValues) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <InputText
              {...field}
              required
              label="Question Title"
              placeholder="example@email.com"
              description="Be specific and imagine you are asking a question to another person."
            />
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({field}) => (
            <InputText
              {...field}
              required
              label="Detailed explanation of your problem"
              placeholder="Explanation of your problem"
              description="Introduce the problem and expand on what you are put in the title."
            />
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({field}) => (
            <InputText
              {...field}
              required
              label="Tags"
              placeholder="Add tags ..."
              description="Add up to 3 tags to describe what your question is about."
            />
          )}
        />
        <div className="mt-16 flex justify-end">
          <FormSubmit disabled={form.formState.isSubmitting}>
            Ask A Question
          </FormSubmit>
        </div>
      </form>
    </Form>
  );
}
