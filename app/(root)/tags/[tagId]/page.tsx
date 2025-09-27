import React from "react";
import {ROUTES} from "@/refs/routes";
import {EMPTY_QUESTION} from "@/refs/states";
import {getTagQuestions} from "@/lib/actions/tag.actions";
import {buildPath} from "@/lib/path/buildPath";
import {LocalSearch} from "@/components/search/LocalSearch";
import {DataRenderer} from "@/components/DataRenderer";
import {CardQuestion} from "@/components/cards/CardQuestion";

type PageTagByIdProps = {
  params: Promise<{tagId: string}>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    query?: string;
  }>;
};

async function PageTagById(props: PageTagByIdProps) {
  const {tagId} = await props.params;
  const {page, pageSize, query} = await props.searchParams;
  const {success, data, error} = await getTagQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    tagId,
  });

  return (
    <React.Fragment>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900 uppercase">
          {data?.tag.name}
        </h1>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={buildPath(ROUTES.TAG_BY_ID, {tagId})}
          image="/icons/search.svg"
          placeholder="Search tags..."
          className="flex-1"
        />
      </section>
      <DataRenderer
        success={success}
        error={error}
        data={data?.data}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {questions.map((question) => (
              <CardQuestion
                key={question._id}
                data={question}
              />
            ))}
          </div>
        )}
      />
    </React.Fragment>
  );
}

export default PageTagById;
