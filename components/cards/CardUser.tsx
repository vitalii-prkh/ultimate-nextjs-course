import Link from "next/link";
import {ROUTES} from "@/refs/routes";
import {TGetUsersData} from "@/lib/actions/user.actions";
import {UserAvatar} from "../UserAvatar";
import {buildPath} from "@/lib/path/buildPath";

type CardUserProps = TGetUsersData["data"][number];

export function CardUser(props: CardUserProps) {
  return (
    <div className="shadow-light100_darknone xs:w-[230px] w-full">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <UserAvatar
          profileId={props._id}
          name={props.name}
          image={props.image || "/images/shadcn.jpeg"}
          className="size-[100px] rounded-full object-cover"
          fallbackClassName="text-3xl tracking-widest"
        />
        <Link href={buildPath(ROUTES.PROFILE_BY_ID, {profileId: props._id})}>
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {props.name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              @{props.username}
            </p>
          </div>
        </Link>
      </article>
    </div>
  );
}
