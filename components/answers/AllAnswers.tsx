import React from "react";
import {EMPTY_ANSWERS} from "@/refs/states";
import {TAnswerInList} from "@/lib/actions/answer.actions";
import {DataRenderer} from "@/components/DataRenderer";
import {CardAnswer} from "@/components/cards/CardAnswer";

type AllAnswersProps = {
  success: boolean;
  total: number;
  data: TAnswerInList[] | null | undefined;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
};

export function AllAnswers(props: AllAnswersProps) {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {`${props.total} ${props.total === 1 ? "Answer" : "Answers"}`}
        </h3>
      </div>
      <DataRenderer
        data={props.data}
        error={props.error}
        success={props.success}
        empty={EMPTY_ANSWERS}
        render={(answers) => (
          <div>
            {answers.map((answer) => (
              <CardAnswer
                key={answer._id}
                {...answer}
              />
            ))}
          </div>
        )}
      />
    </div>
  );
}
