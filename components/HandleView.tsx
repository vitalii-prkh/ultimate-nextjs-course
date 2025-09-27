"use client";

import React from "react";
import {toast} from "sonner";
import {incrementViews} from "@/lib/actions/question.actions";

type ViewProps = {
  questionId: string;
};

export function HandleView(props: ViewProps) {
  const {questionId} = props;

  React.useEffect(() => {
    incrementViews({questionId}).then((result) => {
      if (result.success) {
        toast.success("Success", {
          description: "Views incremented successfully.",
        });
      } else {
        toast.error("Error", {
          description: result?.error?.message,
        });
      }
    });
  }, [questionId]);

  return null;
}
