import {InferSchemaType, Schema, model, models} from "mongoose";
import {RecordWith_id} from "@/db/types.util";

export type TCollectionType = InferSchemaType<typeof schema>;

export type TCollection = RecordWith_id<TCollectionType>;

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
