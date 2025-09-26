"use server";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Account from "@/db/account.model";
import User, {TUserType} from "@/db/user.model";
import {action} from "@/lib/handlers/action";
import {schemaSignUp} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
import {signIn} from "@/auth";
import {ActionResponse, FailureResponse} from "@/types/global";

type AuthCredentials = Pick<TUserType, "name" | "username" | "email"> & {
  password: string;
};

export async function signUpWithCredentials(
  params: AuthCredentials,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: schemaSignUp,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as FailureResponse;
  }

  const {name, username, email, password} = validationResult.params!;
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const existingUser = await User.findOne({email}).session(session);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({username}).session(session);

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [newUser] = await User.create([{username, name, email}], {session});

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      {session},
    );

    await session.commitTransaction();
    await signIn("credentials", {email, password, redirect: false});

    return {success: true};
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as FailureResponse;
  } finally {
    await session.endSession();
  }
}
