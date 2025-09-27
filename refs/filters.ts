export const FILTERS = {
  NEWEST: "newest",
  POPULAR: "popular",
  UNANSWERED: "unanswered",
  RECOMMENDED: "recommended",
  NAME: "name",
  RECENT: "recent",
  OLDEST: "oldest",
  MOST_VOTED: "mostvoted",
  MOST_VIEWED: "mostviewed",
  MOST_RECENT: "mostrecent",
  MOST_ANSWERED: "mostanswered",
  QUESTION: "question",
  ANSWER: "answer",
  USER: "user",
  TAG: "tag",
} as const;

export const HOME_FILTERS = [
  {label: "Newest", value: FILTERS.NEWEST},
  {label: "Popular", value: FILTERS.POPULAR},
  {label: "Unanswered", value: FILTERS.UNANSWERED},
  {label: "Recommended", value: FILTERS.RECOMMENDED},
] as const;

export const TAG_FILTERS = [
  {label: "A-Z", value: FILTERS.NAME},
  {label: "Recent", value: FILTERS.RECENT},
  {label: "Oldest", value: FILTERS.OLDEST},
  {label: "Popular", value: FILTERS.POPULAR},
] as const;

export const ANSWER_FILTERS = [
  {label: "Newest", value: FILTERS.NEWEST},
  {label: "Oldest", value: FILTERS.OLDEST},
  {label: "Popular", value: FILTERS.POPULAR},
] as const;

export const COLLECTION_FILTERS = [
  {label: "Oldest", value: FILTERS.OLDEST},
  {label: "Most Voted", value: FILTERS.MOST_VOTED},
  {label: "Most Viewed", value: FILTERS.MOST_VIEWED},
  {label: "Most Recent", value: FILTERS.MOST_RECENT},
  {label: "Most Answered", value: FILTERS.MOST_ANSWERED},
] as const;

export const USER_FILTERS = [
  {label: "Newest", value: FILTERS.NEWEST},
  {label: "Oldest", value: FILTERS.OLDEST},
  {label: "Popular", value: FILTERS.POPULAR},
] as const;

export const GLOBAL_FILTERS = [
  {label: "Question", value: FILTERS.QUESTION},
  {label: "Answer", value: FILTERS.ANSWER},
  {label: "User", value: FILTERS.USER},
  {label: "Tag", value: FILTERS.TAG},
] as const;
