import Link from "next/link";
import {ROUTES} from "@/refs/routes";
import {EMPTY_QUESTION} from "@/refs/states";
import {getQuestions} from "@/lib/actions/question.actions";
import {Button} from "@/components/ui/button";
import {LocalSearch} from "@/components/search/LocalSearch";
import {HomeTags} from "@/components/filters/HomeTags";
import {DataRenderer} from "@/components/DataRenderer";
import {CardQuestion} from "@/components/cards/CardQuestion";

type PageHomeProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    query?: string;
    tag?: string;
  }>;
};

async function PageHome(props: PageHomeProps) {
  const {page, pageSize, query, tag} = await props.searchParams;
  const {success, data, error} = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: tag || "",
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          asChild
          className="primary-gradient !text-light-900 min-h-[46px] px-4 py-3"
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.HOME}
          image="/icons/search.svg"
          placeholder="Search questions..."
          className="flex-1"
        />
      </section>
      <HomeTags />
      <DataRenderer
        success={success}
        error={error}
        data={data?.data}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <CardQuestion
                key={question._id}
                data={question}
              />
            ))}
          </div>
        )}
      />
    </>
  );
}

export default PageHome;
