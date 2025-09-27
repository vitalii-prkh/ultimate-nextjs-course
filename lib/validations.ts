import {z} from "zod";

export const schemaSignIn = z.object({
  email: z.email({message: "Please provide a valid email address."}),
  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters long."})
    .max(100, {message: "Password cannot exceed 100 characters."}),
});

export const schemaSignUp = z.object({
  username: z
    .string()
    .min(3, {message: "Username must be at least 3 characters long."})
    .max(30, {message: "Username cannot exceed 30 characters."})
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
  name: z
    .string()
    .min(1, {message: "Name is required."})
    .max(50, {message: "Name cannot exceed 50 characters."})
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  email: z.email({message: "Please provide a valid email address."}),
  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters long."})
    .max(100, {message: "Password cannot exceed 100 characters."})
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {message: "Password must contain at least one number."})
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const schemaAskQuestion = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(130, {message: "Title musn't be longer then 130 characters."}),
  content: z.string().min(100, {message: "Minimum of 100 characters."}),
  tags: z
    .array(
      z
        .string()
        .min(1, {message: "Tag must have at least 1 character."})
        .max(15, {message: "Tag must not exceed 15 characters."}),
    )
    .min(1, {message: "Add at least one tag."})
    .max(3, {message: "Maximum of 3 tags."}),
});

export const schemaUpdateQuestion = schemaAskQuestion.extend({
  _id: z.string().min(1, {message: "Question ID is required."}),
});

export const schemaGetQuestion = z.object({
  questionId: z.string().min(1, {message: "Question ID is required."}),
});

export const schemaUser = z.object({
  name: z.string().min(1, {message: "Name is required."}),
  username: z
    .string()
    .min(3, {message: "Username must be at least 3 characters long."}),
  email: z.email({message: "Please provide a valid email address."}),
  bio: z.string().optional(),
  image: z.url({message: "Please provide a valid URL."}).optional(),
  location: z.string().optional(),
  portfolio: z.url({message: "Please provide a valid URL."}).optional(),
  reputation: z.number().optional(),
});

export const schemaAccount = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  image: z.url("Invalid image URL").optional(),
  password: z
    .string()
    .min(6, {message: "Password must be at least 6 characters long."})
    .max(100, {message: "Password cannot exceed 100 characters."})
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, {message: "Password must contain at least one number."})
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
});

export const schemaSignInWithOAuth = z.object({
  provider: z.enum(["github", "google"]),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
  user: z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.email("Invalid email address"),
    image: z.url("Invalid image URL").optional(),
  }),
});

export const schemaSearchParams = z.object({
  page: z.number().min(1, "Page must be at least 1").default(1),
  pageSize: z.number().min(1, "Page size must be at least 1").default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const schemaSearchTagQuestionsParams = schemaSearchParams.extend({
  tagId: z.string().min(1, {message: "Tag ID is required"}),
});

export const schemaIncrementViews = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});
