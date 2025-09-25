import {InferSchemaType, Require_id, Schema, model, models} from "mongoose";

export type TQuestionType = InferSchemaType<typeof schema>;

export type TQuestionData = Require_id<TQuestionType>;

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Question = models?.Question || model<TQuestionType>("Question", schema);

export default Question;
