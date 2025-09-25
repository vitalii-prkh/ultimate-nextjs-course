import {InferSchemaType, Schema, model, models} from "mongoose";
import {RecordWith_id} from "@/db/types.util";

export type TTagType = InferSchemaType<typeof schema>;

export type TTagData = RecordWith_id<TTagType>;

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

const Tag = models?.Tag || model<TTagType>("Tag", schema);

export default Tag;
