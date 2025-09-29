import Link from "next/link";
import Image from "next/image";
import {ROUTES} from "@/refs/routes";
import {buildPath} from "@/lib/path/buildPath";
import {getHotQuestions} from "@/lib/actions/question.actions";
import {getTopTags} from "@/lib/actions/tag.actions";
import {DataRenderer} from "@/components/DataRenderer";
import {CardTagView} from "@/components/cards/CardTagView";

export async function RightNav() {
  const [
    {success: questionsSuccess, data: questionsData, error: questionsError},
    {success: tagsSuccess, data: tagsData, error: tagsError},
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="custom-scrollar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 max-xl:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <DataRenderer
          data={questionsData}
          empty={{
            title: "No questions found",
            message: "No questions have been asked yet.",
          }}
          success={questionsSuccess}
          error={questionsError}
          render={(questions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {questions.map(({_id, title}) => (
                <Link
                  key={_id}
                  href={buildPath(ROUTES.QUESTION_BY_ID, {questionId: _id})}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="paragraph-medium text-dark500_light700 line-clamp-2">
                    {title}
                  </p>
                  <Image
                    src="/icons/chevron-right.svg"
                    alt="chevron right"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <DataRenderer
          data={tagsData}
          empty={{
            title: "No tags found",
            message: "No tags have been asked yet.",
          }}
          success={tagsSuccess}
          error={tagsError}
          render={(tags) => (
            <div className="mt-7 flex flex-col gap-4">
              {tags.map((tag) => (
                <CardTagView
                  key={tag._id}
                  _id={tag._id}
                  name={tag.name}
                  questions={tag.questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
}
