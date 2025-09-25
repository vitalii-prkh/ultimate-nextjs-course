import {InferSchemaType, Require_id, Schema, model, models} from "mongoose";

export type TAnswerType = InferSchemaType<typeof schema>;

export type TAnswerData = Require_id<TAnswerType>;

const schema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Answer = models?.Answer || model<TAnswerType>("Answer", schema);

export default Answer;
