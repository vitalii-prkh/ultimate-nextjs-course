import {InferSchemaType, Require_id, Schema, model, models} from "mongoose";

export type TCollectionType = InferSchemaType<typeof schema>;

export type TCollectionData = Require_id<TCollectionType>;

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
  },
  {
    timestamps: true,
  },
);

const Collection =
  models?.Collection || model<TCollectionType>("Collection", schema);

export default Collection;
