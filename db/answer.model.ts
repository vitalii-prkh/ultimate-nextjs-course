import {InferSchemaType, Schema, model, models} from "mongoose";
import {RecordWith_id} from "@/db/types.util";

export type TAnswerType = InferSchemaType<typeof schema>;

export type TAnswerData = RecordWith_id<TAnswerType>;

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
