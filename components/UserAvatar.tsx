import React from "react";
import Link from "next/link";
import Image from "next/image";
import {ROUTES} from "@/refs/routes";
import {buildPath} from "@/lib/path/buildPath";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

type UserAvatarProps = {
  profileId: string;
  name: string;
  image: string;
};

export function UserAvatar(props: UserAvatarProps) {
  const {profileId} = props;
  const initials = props.name
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <Link href={buildPath(ROUTES.PROFILE_BY_ID, {profileId})}>
      <Avatar className="h-9 w-9">
        {props.image ? (
          <Image
            src={props.image}
            alt={props.name}
            width={36}
            height={36}
            className="object-cover"
            quality={100}
          />
        ) : (
          <AvatarFallback className="primary-gradient font-space-grotesk font-bold tracking-wider text-white">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
}
