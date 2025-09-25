import {NextResponse} from "next/server";
import Account from "@/db/account.model";
import dbConnect from "@/lib/mongoose";
import {handleError} from "@/lib/handlers/error";
import {schemaAccount} from "@/lib/validations";
import {ForbiddenError} from "@/lib/http-errors";

export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find();

    return NextResponse.json({success: true, data: accounts}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const validatedData = schemaAccount.parse(body);
    const {provider, providerAccountId} = validatedData;
    const existingAccount = await Account.findOne({
      provider,
      providerAccountId,
    });

    if (existingAccount) {
      throw new ForbiddenError("Account with the same provider already exists");
    }

    const newAccount = await Account.create(validatedData);

    return NextResponse.json({success: true, data: newAccount}, {status: 201});
  } catch (error) {
    return handleError(error, "api");
  }
}
