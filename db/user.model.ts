import {InferSchemaType, Schema, model, models} from "mongoose";
import {RecordWith_id} from "@/db/types.util";

export type TUserType = InferSchemaType<typeof schema>;

export type TUserData = RecordWith_id<TUserType>;

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

const User = models?.User || model<TUserType>("User", schema);

export default User;
