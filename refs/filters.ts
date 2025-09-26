export const FILTERS = {
  NEWEST: "newest",
  POPULAR: "popular",
  UNANSWERED: "unanswered",
  RECOMMENDED: "recommended",
} as const;

export const FILTER_OPTIONS = [
  {label: "Newest", value: FILTERS.NEWEST},
  {label: "Popular", value: FILTERS.POPULAR},
  {label: "Unanswered", value: FILTERS.UNANSWERED},
  {label: "Recommended", value: FILTERS.RECOMMENDED},
] as const;
