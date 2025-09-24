import {InferSchemaType, Schema, model, models} from "mongoose";

export type TTag = InferSchemaType<typeof schema>;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    questions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Tag = models?.Tag || model<TTag>("Tag", schema);

export default Tag;
