import {InferSchemaType, Schema, model, models} from "mongoose";

export type TAccount = InferSchemaType<typeof schema>;

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

const Account = models?.Account || model<TAccount>("Account", schema);

export default Account;
