import React from "react";
import Link from "next/link";
import {ROUTES} from "@/refs/routes";
import {TAnswerInList} from "@/lib/actions/answer.actions";
import {buildPath} from "@/lib/path/buildPath";
import {getTimeStamp} from "@/lib/utils";
import {UserAvatar} from "@/components/UserAvatar";
import {Preview} from "@/components/editor/Preview";
import {Votes} from "@/components/votes/Votes";
import {hasVoted} from "@/lib/actions/vote.actions";

export function CardAnswer(props: TAnswerInList) {
  const {author} = props;
  const targetType = "answer";
  const targetId = props._id;
  const hasVotedPromise = hasVoted({targetId, targetType});

  return (
    <article className="light-border border-b py-10">
      <span
        id={props._id}
        className="hash-span"
      />
      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            profileId={author._id}
            name={author.name}
            image={author.image || "/images/shadcn.jpeg"}
            className="size-5 rounded-full object-cover max-sm:mt-0.5"
          />
          <Link
            href={buildPath(ROUTES.PROFILE_BY_ID, {profileId: author._id})}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>
            <p className="small-regular text-dark400_light500 line-clamp-1">
              <span className="max-sm:hidden sm:mx-0.5">{"•"}</span>
              {`answered ${getTimeStamp(new Date(props.createdAt))}`}
            </p>
          </Link>
        </div>
        <div className="flex justify-end">
          <React.Suspense fallback={<div>Loading...</div>}>
            <Votes
              hasVotedPromise={hasVotedPromise}
              upvotes={props.upvotes}
              downvotes={props.downvotes}
              targetType={targetType}
              targetId={targetId}
            />
          </React.Suspense>
        </div>
      </div>
      <Preview content={props.content} />
    </article>
  );
}
