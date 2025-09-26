import {
  InferSchemaType,
  Require_id,
  Schema,
  model,
  models,
  HydratedDocument,
  ObjectIdToString,
  Model,
} from "mongoose";

export type TTagDoc = InferSchemaType<typeof schema>;

export type TTagHydrated = HydratedDocument<TTagDoc>;

export type TTagJSON = ObjectIdToString<Require_id<TTagDoc>>;

export type TTagModel = Model<TTagDoc>;

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

const Tag =
  (models?.Tag as TTagModel) || model<TTagDoc, TTagModel>("Tag", schema);

export default Tag;
