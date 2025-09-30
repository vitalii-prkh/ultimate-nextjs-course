import React from "react";
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/job.actions";
import {CardJob} from "@/components/cards/CardJob";
import {JobsFilters} from "@/components/filters/JobFilters";
import {Pagination} from "@/components/Pagination";

type PageJobsProps = {
  searchParams: Promise<{
    query?: string;
    location?: string;
    page?: string;
  }>;
};

async function PageJobs(props: PageJobsProps) {
  const {query, location, page} = await props.searchParams;
  const {data: userLocation} = await fetchLocation();
  const {data: jobs} = await fetchJobs({
    query: `${query}, ${location}` || `Software Engineer in ${userLocation}`,
    page: page ?? "1",
    pageSize: "1",
  });
  const {data: countries} = await fetchCountries();
  const parsedPage = parseInt(page ?? "1");

  return (
    <React.Fragment>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <div className="flex">
        <JobsFilters countriesList={countries} />
      </div>

      <section className="light-border mt-11 mb-9 flex flex-col gap-9 border-b pb-9">
        {!jobs?.length && (
          <div className="paragraph-regular text-dark200_light800 w-full text-center">
            Oops! We couldn&apos;t find any jobs at the moment. Please try again
            later
          </div>
        )}
        {jobs
          ?.filter((job) => job.job_title)
          .map((job) => (
            <CardJob
              key={job.job_id}
              job={job}
            />
          ))}
      </section>
      {jobs?.length > 0 && (
        <Pagination
          page={parsedPage}
          isNext={jobs?.length === 10}
        />
      )}
    </React.Fragment>
  );
}

export default PageJobs;
