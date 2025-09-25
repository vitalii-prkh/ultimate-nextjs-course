import {NextResponse} from "next/server";
import {z} from "zod";
import User from "@/db/user.model";
import dbConnect from "@/lib/mongoose";
import {handleError} from "@/lib/handlers/error";
import {schemaUser} from "@/lib/validations";
import {ValidationError} from "@/lib/http-errors";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return NextResponse.json({success: true, data: users}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const validatedData = schemaUser.safeParse(body);

    if (!validatedData.success) {
      const flattedErrors = z.flattenError(validatedData.error).fieldErrors;

      throw new ValidationError(flattedErrors);
    }

    const {email, username} = validatedData.data;
    const existingEmail = await User.findOne({email});

    if (existingEmail) {
      throw new Error("User with such email already exists");
    }

    const existingUsername = await User.findOne({username});

    if (existingUsername) {
      throw new Error("User with such username already exists");
    }

    const newUser = await User.create(validatedData.data);

    return NextResponse.json({success: true, data: newUser}, {status: 201});
  } catch (error) {
    return handleError(error, "api");
  }
}
