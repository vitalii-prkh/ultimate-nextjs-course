import {
  InferSchemaType,
  Require_id,
  ObjectIdToString,
  HydratedDocument,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

export type TQuestionDoc = InferSchemaType<typeof schema>;

export type TQuestionHydrated = HydratedDocument<TQuestionDoc>;

export type TQuestionJSON = ObjectIdToString<Require_id<TQuestionDoc>>;

export type TQuestionModel = Model<TQuestionDoc>;

const schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    answers: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Question =
  (models?.Question as TQuestionModel) ||
  model<TQuestionDoc, TQuestionModel>("Question", schema);

export default Question;
