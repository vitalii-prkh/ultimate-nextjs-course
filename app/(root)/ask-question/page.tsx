import React from "react";
import {redirect} from "next/navigation";
import {auth} from "@/auth";
import {ROUTES} from "@/refs/routes";
import {FormQuestion} from "@/components/forms/FormQuestion";

async function PageAskQuestion() {
  const session = await auth();

  if (!session) {
    redirect(ROUTES.SIGN_IN);
  }

  return (
    <React.Fragment>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <div className="mt-9">
        <FormQuestion />
      </div>
    </React.Fragment>
  );
}

export default PageAskQuestion;
