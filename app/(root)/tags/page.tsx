import React from "react";
import {ROUTES} from "@/refs/routes";
import {TAG_FILTERS} from "@/refs/filters";
import {EMPTY_TAGS} from "@/refs/states";
import {getTags} from "@/lib/actions/tag.actions";
import {LocalSearch} from "@/components/search/LocalSearch";
import {CardTagView} from "@/components/cards/CardTagView";
import {DataRenderer} from "@/components/DataRenderer";
import {CommonFilters} from "@/components/CommonFilters";
import {Pagination} from "@/components/Pagination";

type PageTagsProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    query?: string;
    filter?: string;
  }>;
};

async function PageTags(props: PageTagsProps) {
  const {page, pageSize, query, filter} = await props.searchParams;
  const {success, data, error} = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  return (
    <React.Fragment>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.TAGS}
          image="/icons/search.svg"
          placeholder="Search tags..."
          className="flex-1"
        />
        <CommonFilters
          filters={TAG_FILTERS}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </section>
      <DataRenderer
        success={success}
        error={error}
        data={data?.data}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <CardTagView
                key={tag._id}
                {...tag}
              />
            ))}
          </div>
        )}
      />
      <Pagination
        page={page}
        isNext={data?.isNext || false}
      />
    </React.Fragment>
  );
}

export default PageTags;
