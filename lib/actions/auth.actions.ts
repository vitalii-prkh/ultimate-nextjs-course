"use server";

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Account from "@/db/account.model";
import User, {TUserType} from "@/db/user.model";
import {action} from "@/lib/handlers/action";
import {signIn, signOut} from "@/auth";
import {schemaSignUp, schemaSignIn} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
import {ActionResponse, FailureResponse} from "@/types/global";
import {NotFoundError} from "@/lib/http-errors";

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

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: schemaSignIn,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as FailureResponse;
  }

  const {email, password} = validationResult.params!;

  try {
    const existingUser = await User.findOne({email});

    if (!existingUser) {
      throw new NotFoundError("User");
    }

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });

    if (!existingAccount) {
      throw new NotFoundError("Account");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password,
    );

    if (!passwordMatch) {
      throw new Error("Password is incorrect");
    }

    await signIn("credentials", {email, password, redirect: false});

    return {success: true};
  } catch (error) {
    return handleError(error) as FailureResponse;
  }
}

export async function logOut() {
  await signOut();
}
