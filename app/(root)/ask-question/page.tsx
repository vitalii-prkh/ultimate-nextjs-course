import React from "react";
import {FormQuestion} from "@/components/forms/FormQuestion";

function PageAskQuestion() {
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
