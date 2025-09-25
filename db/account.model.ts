import {InferSchemaType, Require_id, Schema, model, models} from "mongoose";

export type TAccountType = InferSchemaType<typeof schema>;

export type TAccountData = Require_id<TAccountType>;

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
    },
    provider: {
      type: String,
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Account = models?.Account || model<TAccountType>("Account", schema);

export default Account;
