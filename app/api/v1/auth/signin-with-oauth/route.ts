import {NextResponse} from "next/server";
import mongoose from "mongoose";
import {z} from "zod";
import slugify from "slugify";
import User from "@/db/user.model";
import Account from "@/db/account.model";
import dbConnect from "@/lib/mongoose";
import {handleError} from "@/lib/handlers/error";
import {ValidationError} from "@/lib/http-errors";
import {schemaSignInWithOAuth} from "@/lib/validations";

export async function POST(req: Request) {
  const {provider, providerAccountId, user} = await req.json();

  await dbConnect();

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const validatedData = schemaSignInWithOAuth.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success) {
      const fieldErrors = z.flattenError(validatedData.error).fieldErrors;

      throw new ValidationError(fieldErrors);
    }

    const {name, username, email, image} = user;
    const slugified = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });
    let existingUser = await User.findOne({email}).session(session);

    if (existingUser) {
      const updated: {name?: string; image?: string} = {};

      if (existingUser.name !== name) {
        updated.name = name;
      }

      if (existingUser.image !== image) {
        updated.image = image;
      }

      if (Object.keys(updated).length > 0) {
        await User.updateOne({_id: existingUser._id}, {$set: updated}).session(
          session,
        );
      }
    } else {
      [existingUser] = await User.create(
        [{name, username: slugified, email, image}],
        {session},
      );
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [{userId: existingUser._id, name, image, provider, providerAccountId}],
        {session},
      );
    }

    await session.commitTransaction();

    return NextResponse.json({success: true});
  } catch (error) {
    await session.abortTransaction();

    return handleError(error, "api");
  } finally {
    await session.endSession();
  }
}
