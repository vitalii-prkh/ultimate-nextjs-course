import {InferSchemaType, Schema, model, models} from "mongoose";

export type TVote = InferSchemaType<typeof schema>;

const schema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    actionType: {
      type: String,
      enum: ["question", "answer"],
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Vote = models?.Vote || model<TVote>("Vote", schema);

export default Vote;
