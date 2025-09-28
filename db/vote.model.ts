import {
  InferSchemaType,
  HydratedDocument,
  ObjectIdToString,
  Require_id,
  Schema,
  model,
  models,
  Model,
} from "mongoose";

export type TVoteDoc = InferSchemaType<typeof schema>;

export type TVoteHydrated = HydratedDocument<TVoteDoc>;

export type TVoteJSON = ObjectIdToString<Require_id<TVoteDoc>>;

export type TVoteModel = Model<TVoteDoc>;

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

const Vote =
  (models?.Vote as TVoteModel) || model<TVoteDoc, TVoteModel>("Vote", schema);

export default Vote;
