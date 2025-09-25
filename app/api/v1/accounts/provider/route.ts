import {NextResponse} from "next/server";
import {z} from "zod";
import Account from "@/db/account.model";
import dbConnect from "@/lib/mongoose";
import {schemaAccount} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
import {ValidationError, NotFoundError} from "@/lib/http-errors";

export async function POST(req: Request) {
  const {providerAccountId} = await req.json();

  try {
    await dbConnect();

    const validatedData = schemaAccount
      .partial()
      .safeParse({providerAccountId});

    if (!validatedData.success) {
      const flattedErrors = z.flattenError(validatedData.error).fieldErrors;

      throw new ValidationError(flattedErrors);
    }

    const account = await Account.findOne({providerAccountId});

    if (!account) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json({success: true, data: account}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}
