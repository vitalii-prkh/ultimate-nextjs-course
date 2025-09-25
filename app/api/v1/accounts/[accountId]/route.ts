import {NextResponse} from "next/server";
import {z} from "zod";
import Account from "@/db/account.model";
import dbConnect from "@/lib/mongoose";
import {schemaAccount} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
import {NotFoundError, ValidationError} from "@/lib/http-errors";

export async function GET(
  _: Request,
  ctx: RouteContext<"/api/v1/accounts/[accountId]">,
) {
  const {accountId} = await ctx.params;

  if (!accountId) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    const account = await Account.findById(accountId);

    if (!account) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json({success: true, data: account}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}

export async function PUT(
  req: Request,
  ctx: RouteContext<"/api/v1/accounts/[accountId]">,
) {
  const {accountId} = await ctx.params;

  if (!accountId) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    const body = await req.json();
    const validatedData = schemaAccount.partial().safeParse(body);

    if (!validatedData.success) {
      const flattedErrors = z.flattenError(validatedData.error).fieldErrors;

      throw new ValidationError(flattedErrors);
    }

    const account = await Account.findByIdAndUpdate(accountId, validatedData, {
      new: true,
    });

    if (!account) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json({success: true, data: account}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}

export async function DELETE(
  _: Request,
  ctx: RouteContext<"/api/v1/accounts/[accountId]">,
) {
  const {accountId} = await ctx.params;

  if (!accountId) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    const account = await Account.findByIdAndDelete(accountId);

    if (!account) {
      throw new NotFoundError("Account");
    }

    return NextResponse.json({success: true, data: account}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}
