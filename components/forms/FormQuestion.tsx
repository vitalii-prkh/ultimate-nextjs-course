"use client";

import React from "react";
import {useRouter} from "next/navigation";
import {useForm, SubmitHandler} from "react-hook-form";
import {Loader} from "lucide-react";
import {toast} from "sonner";
import {z} from "zod";
import {standardSchemaResolver} from "@hookform/resolvers/standard-schema";
import {ROUTES} from "@/refs/routes";
import {buildPath} from "@/lib/path/buildPath";
import {createQuestion, updateQuestion} from "@/lib/actions/question.actions";
import {schemaAskQuestion} from "@/lib/validations";
import {Form, FormField} from "@/components/ui/form";
import {InputText} from "@/components/InputText";
import {InputEditor} from "@/components/InputEditor";
import {InputTags} from "@/components/InputTags";
import {FormSubmit} from "@/components/FormSubmit";

type FormAskQuestionValues = z.infer<typeof schemaAskQuestion>;

type FormQuestionProps = {
  isUpdate?: boolean;
  data?: {
    questionId: string;
    title: string;
    content: string;
    tags: string[];
  };
};

export function FormQuestion(props: FormQuestionProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<FormAskQuestionValues>({
    defaultValues: {
      title: props.data?.title || "",
      content: props.data?.content || "",
      tags: props.data?.tags || [],
    },
    resolver: standardSchemaResolver(schemaAskQuestion),
  });
  const handleSubmit: SubmitHandler<FormAskQuestionValues> = async (values) => {
    startTransition(async () => {
      if (props.isUpdate) {
        const result = await updateQuestion({
          // @ts-expect-error: We are learning, ignore is ok. On real projects need to keep different forms and reuse the ui.
          _id: props.data.questionId,
          ...values,
        });

        if (result.success) {
          toast.success("Success", {
            description: "Question updated successfully.",
          });

          router.push(
            buildPath(ROUTES.QUESTION_BY_ID, {questionId: result.data._id}),
          );
        } else {
          toast.error(`Error ${result?.status}`, {
            description: result?.error?.message,
          });
        }
      } else {
        const result = await createQuestion(values);

        if (result.success) {
          toast.success("Success", {
            description: "Question created successfully.",
          });

          router.push(
            buildPath(ROUTES.QUESTION_BY_ID, {questionId: result.data._id}),
          );
        } else {
          toast.error(`Error ${result?.status}`, {
            description: result?.error?.message,
          });
        }
      }
    });
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
              placeholder="Enter a title"
              description="Be specific and imagine you are asking a question to another person."
            />
          )}
        />
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
        <FormField
          control={form.control}
          name="tags"
          render={({field}) => (
            <InputTags
              {...field}
              required
              label="Tags"
              placeholder="Add tags ..."
              description="Add up to 3 tags to describe what your question is about."
              onKeyDownEnter={(message) => {
                if (message == null) {
                  form.clearErrors("tags");
                } else {
                  form.setError("tags", {type: "manual", message});
                }
              }}
            />
          )}
        />
        <div className="mt-16 flex justify-end">
          <FormSubmit disabled={isPending}>
            {isPending && (
              <React.Fragment>
                <Loader className="mr-2 size-4 animate-spin" />
                Submitting...
              </React.Fragment>
            )}
            {!isPending && (props.isUpdate ? "Update" : "Ask A Question")}
          </FormSubmit>
        </div>
      </form>
    </Form>
  );
}
