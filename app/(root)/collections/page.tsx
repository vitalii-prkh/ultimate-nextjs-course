import {ROUTES} from "@/refs/routes";
import {EMPTY_QUESTION} from "@/refs/states";
import {COLLECTION_FILTERS} from "@/refs/filters";
import {getSavedQuestions} from "@/lib/actions/collection.actions";
import {LocalSearch} from "@/components/search/LocalSearch";
import {CommonFilters} from "@/components/CommonFilters";
import {DataRenderer} from "@/components/DataRenderer";
import {CardQuestion} from "@/components/cards/CardQuestion";

type PageHomeProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    query?: string;
    filter?: string;
  }>;
};

async function PageCollections(props: PageHomeProps) {
  const {page, pageSize, query, filter} = await props.searchParams;
  const {success, data, error} = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COLLECTIONS}
          image="/icons/search.svg"
          placeholder="Search questions..."
          className="flex-1"
        />
        <CommonFilters
          filters={COLLECTION_FILTERS}
          otherClasses="min-h-[56px] sm:min-2-[170px]"
        />
      </section>
      <DataRenderer
        success={success}
        error={error}
        data={data?.data}
        empty={EMPTY_QUESTION}
        render={(collections) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collections.map((collection) => (
              <CardQuestion
                key={collection.question._id}
                data={collection.question}
              />
            ))}
          </div>
        )}
      />
    </>
  );
}

export default PageCollections;
