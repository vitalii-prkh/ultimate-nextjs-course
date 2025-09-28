import React from "react";
import {ROUTES} from "@/refs/routes";
import {EMPTY_USERS} from "@/refs/states";
import {USER_FILTERS} from "@/refs/filters";
import {getUsers} from "@/lib/actions/user.actions";
import {LocalSearch} from "@/components/search/LocalSearch";
import {DataRenderer} from "@/components/DataRenderer";
import {HomeTags} from "@/components/filters/HomeTags";
import {CardUser} from "@/components/cards/CardUser";

type PageCommunityProps = {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    query?: string;
    tag?: string;
  }>;
};

async function PageCommunity(props: PageCommunityProps) {
  const {page, pageSize, query, tag} = await props.searchParams;
  const {success, data, error} = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: tag || "",
  });

  return (
    <React.Fragment>
      <section>
        <h1 className="h1-bold text-dark100_light900"></h1>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          image="/icons/search.svg"
          placeholder="Search users..."
          className="flex-1"
        />
      </section>
      <HomeTags options={USER_FILTERS} />
      <DataRenderer
        success={success}
        error={error}
        data={data?.data}
        empty={EMPTY_USERS}
        render={(users) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users.map((user) => (
              <CardUser
                key={user._id}
                {...user}
              />
            ))}
          </div>
        )}
      />
    </React.Fragment>
  );
}

export default PageCommunity;
