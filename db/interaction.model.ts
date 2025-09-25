import {InferSchemaType, Require_id, Schema, model, models} from "mongoose";

export const InteractionActionEnums = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
] as const;

export type TInteractionType = InferSchemaType<typeof schema>;

export type TInteractionData = Require_id<TInteractionType>;

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: InteractionActionEnums,
      required: true,
    },
    // 'questionId', 'answerId',
    actionId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    actionType: {
      type: String,
      enum: ["question", "answer"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Interaction =
  models?.Interaction || model<TInteractionType>("Interaction", schema);

export default Interaction;
