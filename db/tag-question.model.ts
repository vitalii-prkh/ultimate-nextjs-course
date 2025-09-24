import {InferSchemaType, Schema, model, models} from "mongoose";

export type TTagQuestion = InferSchemaType<typeof schema>;

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
  models?.TagQuestion || model<TTagQuestion>("TagQuestion", schema);

export default TagQuestion;
