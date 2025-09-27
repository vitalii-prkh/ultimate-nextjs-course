import React from "react";
import {ROUTES} from "@/refs/routes";
import {TAG_FILTERS} from "@/refs/filters";
import {EMPTY_TAGS} from "@/refs/states";
import {getTags} from "@/lib/actions/tag.actions";
import {LocalSearch} from "@/components/search/LocalSearch";
import {HomeTags} from "@/components/filters/HomeTags";
import {CardTagView} from "@/components/cards/CardTagView";
import {DataRenderer} from "@/components/DataRenderer";

type PageTagsProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    query?: string;
    tag?: string;
  }>;
};

async function PageTags(props: PageTagsProps) {
  const {page, pageSize, query, tag} = await props.searchParams;
  const {success, data, error} = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: tag || "",
  });

  return (
    <React.Fragment>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAGS}
          image="/icons/search.svg"
          placeholder="Search tags..."
          className="flex-1"
        />
      </section>
      <HomeTags options={TAG_FILTERS} />
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
    </React.Fragment>
  );
}

export default PageTags;
