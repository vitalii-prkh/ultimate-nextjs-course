import {InferSchemaType, Require_id, Schema, model, models} from "mongoose";

export type TTagQuestionType = InferSchemaType<typeof schema>;

export type TTagQuestionData = Require_id<TTagQuestionType>;

const schema = new Schema(
  {
    tag: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const TagQuestion =
  models?.TagQuestion || model<TTagQuestionType>("TagQuestion", schema);

export default TagQuestion;
