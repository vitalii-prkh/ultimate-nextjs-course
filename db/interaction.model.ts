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

export type TInteractionDoc = InferSchemaType<typeof schema>;

export type TInteractionHydrated = HydratedDocument<TInteractionDoc>;

export type TInteractionJSON = ObjectIdToString<Require_id<TInteractionDoc>>;

export type TInteractionModel = Model<TInteractionDoc>;

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
  (models?.Interaction as TInteractionModel) ||
  model<TInteractionDoc, TInteractionModel>("Interaction", schema);

export default Interaction;
