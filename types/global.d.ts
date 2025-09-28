import {NextResponse} from "next/server";

type EntityQuestion = {
  _id: string;
  title: string;
  description: string;
  tags: EntityTag[];
  author: EntityAuthor;
  upvotes: number;
  answers: number;
  views: number;
  createdAt: string;
};

type EntityTag = {
  _id: string;
  name: string;
};

type EntityAuthor = {
  _id: string;
  name: string;
  image: string;
};

type SuccessResponse<T = undefined> = {
  success: true;
  data: T;
  status?: number;
};

type FailureResponse<T = undefined> = {
  success: false;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type ApiSuccessResponse<T> = NextResponse<SuccessResponse<T>>;

type ApiFailureResponse = NextResponse<FailureResponse>;

type ApiResponse<T = null> = NextResponse<
  SuccessResponse<T> | FailureResponse<T>
>;
