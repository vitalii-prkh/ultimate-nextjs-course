import {ROUTES} from "@/refs/routes";

export const LINKS = [
  {
    image: "/icons/home.svg",
    route: ROUTES.HOME,
    label: "Home",
  },
  {
    image: "/icons/users.svg",
    route: ROUTES.COMMUNITY,
    label: "Community",
  },
  {
    image: "/icons/star.svg",
    route: ROUTES.COLLECTIONS,
    label: "Collections",
  },
  {
    image: "/icons/suitcase.svg",
    route: ROUTES.JOBS,
    label: "Find Jobs",
  },
  {
    image: "/icons/tag.svg",
    route: ROUTES.TAGS,
    label: "Tags",
  },
  {
    image: "/icons/user.svg",
    route: ROUTES.PROFILE_BY_ID,
    label: "Profile",
    isAllowed(params: {profileId?: string} = {}) {
      return Boolean(params.profileId);
    },
  },
  {
    image: "/icons/question.svg",
    route: ROUTES.ASK_QUESTION,
    label: "Ask a question",
  },
];
