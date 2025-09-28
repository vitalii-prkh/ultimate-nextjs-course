import mongoose, {ClientSession} from "mongoose";
import {z} from "zod";
import User from "@/db/user.model";
import Interaction, {TInteractionJSON} from "@/db/interaction.model";
import {action} from "@/lib/handlers/action";
import {handleError} from "@/lib/handlers/error";
import {schemaCreateInteraction} from "@/lib/validations";
import {SuccessResponse, FailureResponse} from "@/types/global";

type TCreateInteractionParams = z.infer<typeof schemaCreateInteraction>;

export async function createInteraction(
  params: TCreateInteractionParams,
): Promise<SuccessResponse<TInteractionJSON> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaCreateInteraction,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {
    action: actionType,
    actionId,
    actionTarget,
    authorId, // person who owns the content (question/answer)
  } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interaction] = await Interaction.create(
      [
        {
          user: userId,
          action: actionType,
          actionId,
          actionType: actionTarget,
        },
      ],
      {session},
    );

    // Update reputation for both the performer and the content author
    await updateReputation(
      {
        interaction,
        performerId: userId!,
        authorId,
      },
      session,
    );

    await session.commitTransaction();

    return {success: true, data: JSON.parse(JSON.stringify(interaction))};
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, "server");
  } finally {
    await session.endSession();
  }
}

type UpdateReputationParams = {
  performerId: string;
  authorId: string;
  interaction: {
    action: string;
    actionType: string;
  };
};

async function updateReputation(
  params: UpdateReputationParams,
  session: ClientSession,
) {
  const {interaction, performerId, authorId} = params;
  const {action, actionType} = interaction;

  let performerPoints = 0;
  let authorPoints = 0;

  switch (action) {
    case "upvote":
      performerPoints = 2;
      authorPoints = 10;
      break;
    case "downvote":
      performerPoints = -1;
      authorPoints = -2;
      break;
    case "post":
      authorPoints = actionType === "question" ? 5 : 10;
      break;
    case "delete":
      authorPoints = actionType === "question" ? -5 : -10;
      break;
  }

  if (performerId === authorId) {
    await User.findByIdAndUpdate(
      performerId,
      {$inc: {reputation: authorPoints}},
      {session},
    );

    return;
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: {_id: performerId},
          update: {$inc: {reputation: performerPoints}},
        },
      },
      {
        updateOne: {
          filter: {_id: authorId},
          update: {$inc: {reputation: authorPoints}},
        },
      },
    ],
    {session},
  );
}
