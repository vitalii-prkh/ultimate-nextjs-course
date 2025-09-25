import {InferSchemaType, Require_id, Schema, model, models} from "mongoose";

export type TVoteType = InferSchemaType<typeof schema>;

export type TVoteData = Require_id<TVoteType>;

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

const Vote = models?.Vote || model<TVoteType>("Vote", schema);

export default Vote;
