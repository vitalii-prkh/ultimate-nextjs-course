import {InferSchemaType, Schema, model, models} from "mongoose";

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

export type TInteraction = InferSchemaType<typeof schema>;

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
  models?.Interaction || model<TInteraction>("Interaction", schema);

export default Interaction;
