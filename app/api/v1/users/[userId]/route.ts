import {NextResponse} from "next/server";
import User from "@/db/user.model";
import dbConnect from "@/lib/mongoose";
import {handleError} from "@/lib/handlers/error";
import {NotFoundError} from "@/lib/http-errors";
import {schemaUser} from "@/lib/validations";

export async function GET(
  _: Request,
  ctx: RouteContext<"/api/v1/users/[userId]">,
) {
  const {userId} = await ctx.params;

  if (!userId) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();

    // const user = await User.findOne({_id: userId});
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({success: true, data: user}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}

export async function PUT(
  req: Request,
  ctx: RouteContext<"/api/v1/users/[userId]">,
) {
  const {userId} = await ctx.params;

  if (!userId) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();

    const body = await req.json();
    const validatedData = schemaUser.partial().parse(body);
    const user = await User.findByIdAndUpdate(userId, validatedData, {
      new: true,
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({success: true, data: user}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}

export async function DELETE(
  _: Request,
  ctx: RouteContext<"/api/v1/users/[userId]">,
) {
  const {userId} = await ctx.params;

  if (!userId) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json({success: true, data: user}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}
