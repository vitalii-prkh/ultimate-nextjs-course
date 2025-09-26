import React from "react";
import {notFound, redirect} from "next/navigation";
import {auth} from "@/auth";
import {ROUTES} from "@/refs/routes";
import {FormQuestion} from "@/components/forms/FormQuestion";
import {getQuestion} from "@/lib/actions/question.actions";
import {buildPath} from "@/lib/path/buildPath";

type PageQuestionUpdateProps = {
  params: Promise<{
    questionId: string;
  }>;
};

async function PageQuestionUpdate(props: PageQuestionUpdateProps) {
  const {questionId} = await props.params;

  if (!questionId) {
    return notFound();
  }

  const session = await auth();

  if (!session) {
    return redirect(ROUTES.SIGN_IN);
  }

  const {success, data} = await getQuestion({questionId});

  if (!success) {
    return notFound();
  }

  if (data.author.toString() !== session?.user?.id) {
    return redirect(buildPath(ROUTES.QUESTION_BY_ID, {questionId}));
  }

  return (
    <main>
      <FormQuestion
        isUpdate
        data={{
          questionId: data._id,
          title: data.title,
          content: data.content,
          tags: data.tags.map((tag) => tag.name),
        }}
      />
    </main>
  );
}

export default PageQuestionUpdate;
