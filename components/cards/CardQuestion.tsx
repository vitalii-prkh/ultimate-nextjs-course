import Link from "next/link";
import {ROUTES} from "@/refs/routes";
import {getTimeStamp} from "@/lib/utils";
import {buildPath} from "@/lib/path/buildPath";
import {CardTag} from "@/components/cards/CardTag";
import {Metric} from "@/components/Metric";

type CardQuestionProps = {
  data: EntityQuestion;
};

export function CardQuestion(props: CardQuestionProps) {
  const {data} = props;

  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex-coll-reverse flex items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(data.createdAt)}
          </span>
          <Link href={buildPath(ROUTES.QUESTION_BY_ID, {questionId: data._id})}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {data.title}
            </h3>
          </Link>
        </div>
      </div>
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {data.tags.map((tag) => (
          <CardTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            compact
          />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Link
          href={buildPath(ROUTES.PROFILE_BY_ID, {profileId: data.author._id})}
        >
          <Metric
            image={data.author.image}
            alt={data.author.name}
            value={data.author.name}
            title={`• asked ${getTimeStamp(new Date(data.createdAt))}`}
            hideOnMobile
          />
        </Link>
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            image="/icons/like.svg"
            alt="like"
            value={data.upvotes}
            title="Votes"
          />
          <Metric
            image="/icons/message.svg"
            alt="answers"
            value={data.answers}
            title="Answers"
          />
          <Metric
            image="/icons/eye.svg"
            alt="views"
            value={data.views}
            title="Views"
          />
        </div>
      </div>
    </div>
  );
}
