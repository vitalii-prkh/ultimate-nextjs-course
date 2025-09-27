import React from "react";
import {after} from "next/server";
import {redirect} from "next/navigation";
import Link from "next/link";
import {ROUTES} from "@/refs/routes";
import {getQuestion, incrementViews} from "@/lib/actions/question.actions";
import {buildPath} from "@/lib/path/buildPath";
import {formatNumber, getTimeStamp} from "@/lib/utils";
import {UserAvatar} from "@/components/UserAvatar";
import {Metric} from "@/components/Metric";
import {CardTagView} from "@/components/cards/CardTagView";
import {Preview} from "@/components/editor/Preview";
import {FormAnswer} from "@/components/forms/FormAnswer";

type PageQuestionProps = {
  params: Promise<{questionId: string}>;
};

async function PageQuestionById(props: PageQuestionProps) {
  const {questionId} = await props.params;
  const {success, data} = await getQuestion({questionId});

  after(async () => {
    await incrementViews({questionId});
  });

  if (!success || !data) {
    return redirect("/404");
  }

  const {author} = data;

  return (
    <React.Fragment>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              profileId={author?._id}
              name={author?.name}
              image={author?.image || "/images/shadcn.jpeg"}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link
              href={buildPath(ROUTES.PROFILE_BY_ID, {profileId: author?._id})}
            >
              <p className="paragraph-semibold text-dark300_light700">
                {author?.name}
              </p>
            </Link>
          </div>
          <div className="flex justify-end">
            <p>Votes</p>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3 w-full">
          {data.title}
        </h2>
      </div>
      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <Metric
          image="/icons/clock.svg"
          alt="clock-icon"
          value=""
          title={`asked ${getTimeStamp(new Date(data.createdAt))}`}
        />
        <Metric
          image="/icons/message.svg"
          alt="message icon"
          value=""
          title={String(data.answers)}
        />
        <Metric
          image="/icons/eye.svg"
          alt="eye icon"
          value=""
          title={formatNumber(data.views)}
        />
      </div>
      <Preview content={data.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {data?.tags.map((tag) => (
          <CardTagView
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            compact
          />
        ))}
      </div>
      <section className="my-5">
        <FormAnswer />
      </section>
    </React.Fragment>
  );
}

export default PageQuestionById;
