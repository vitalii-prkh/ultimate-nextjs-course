import {InferSchemaType, Schema, model, models} from "mongoose";

export type TCollection = InferSchemaType<typeof schema>;

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
  models?.Collection || model<TCollection>("Collection", schema);

export default Collection;
