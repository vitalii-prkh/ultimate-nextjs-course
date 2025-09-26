import {
  InferSchemaType,
  ObjectIdToString,
  Types,
  Schema,
  model,
  models,
} from "mongoose";

export type TTagQuestionType = InferSchemaType<typeof schema>;

export type TTagQuestionData = {
  tag: Types.ObjectId;
  question: Types.ObjectId;
};

export type TTagQuestionJSON = ObjectIdToString<TTagQuestionData>;

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
