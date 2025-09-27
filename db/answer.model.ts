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

export type TAnswerDoc = InferSchemaType<typeof schema>;

export type TAnswerHydrated = HydratedDocument<TAnswerDoc>;

export type TAnswerJSON = ObjectIdToString<Require_id<TAnswerDoc>>;

export type TAnswerModel = Model<TAnswerDoc>;

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
    content: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Answer =
  (models?.Answer as TAnswerModel) ||
  model<TAnswerDoc, TAnswerModel>("Answer", schema);

export default Answer;
