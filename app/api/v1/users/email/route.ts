import {NextResponse} from "next/server";
import {z} from "zod";
import User from "@/db/user.model";
import dbConnect from "@/lib/mongoose";
import {ValidationError, NotFoundError} from "@/lib/http-errors";
import {handleError} from "@/lib/handlers/error";
import {schemaUser} from "@/lib/validations";

export async function POST(req: Request) {
  const {email} = await req.json();

  try {
    await dbConnect();

    const validatedData = schemaUser.partial().safeParse({email});

    if (!validatedData.success) {
      const flattedErrors = z.flattenError(validatedData.error).fieldErrors;

      throw new ValidationError(flattedErrors);
    }

    const user = await User.findOne({email});

    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({success: true, data: user}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}
