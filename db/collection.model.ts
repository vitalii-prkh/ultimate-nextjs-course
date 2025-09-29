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

export type TCollectionDoc = InferSchemaType<typeof schema>;

export type TCollectionHydrated = HydratedDocument<TCollectionDoc>;

export type TCollectionJSON = ObjectIdToString<Require_id<TCollectionDoc>>;

export type TCollectionModel = Model<TCollectionDoc>;

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
  (models?.Collection as TCollectionModel) ||
  model<TCollectionDoc, TCollectionModel>("Collection", schema);

export default Collection;
