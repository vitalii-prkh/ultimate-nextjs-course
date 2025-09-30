type TFetchLocationData = {
  success: boolean;
  data: string;
};

export async function fetchLocation(): Promise<TFetchLocationData> {
  const response = await fetch("http://ip-api.com/json/?fields=country");
  const location = await response.json();

  return location.country;
}

type TFetchCountriesData = {
  success: boolean;
  data: Country[];
};

type Country = {
  name: {
    common: string;
  };
};

export async function fetchCountries(): Promise<TFetchCountriesData> {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name",
    );
    const result = await response.json();

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: [],
    };
  }
}

type TFetchJobsParams = {
  query: string;
  page: string;
  pageSize: string;
};

type TFetchJobsData = {
  success: boolean;
  data: Job[];
};

type Job = {
  job_id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
};

export async function fetchJobs(
  filters: TFetchJobsParams,
): Promise<TFetchJobsData> {
  const {query, page, pageSize = "1"} = filters;
  const headers = {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY ?? "",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  const response = await fetch(
    `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&num_pages=${pageSize}`,
    {
      headers,
    },
  );

  const result = await response.json();

  console.log("result: ", result);

  return {
    success: true,
    data: result.data,
  };
}
