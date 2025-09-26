import {
  InferSchemaType,
  Require_id,
  Schema,
  Model,
  model,
  models,
  HydratedDocument,
  ObjectIdToString,
} from "mongoose";

export type TUserDoc = InferSchemaType<typeof schema>;

export type TUserHydrated = HydratedDocument<TUserDoc>;

export type TUserJSON = ObjectIdToString<Require_id<TUserDoc>>;

export type TUserModel = Model<TUserDoc>;

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    location: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const User =
  (models?.User as TUserModel) || model<TUserDoc, TUserModel>("User", schema);

export default User;
