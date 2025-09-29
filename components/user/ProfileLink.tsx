import Link from "next/link";
import Image from "next/image";

type ProfileLinkProps = {
  image: string;
  href?: string;
  title: string;
};

export function ProfileLink(props: ProfileLinkProps) {
  return (
    <div className="flex-center gap-1">
      <Image
        src={props.image}
        alt={props.title}
        width={20}
        height={20}
      />

      {props.href ? (
        <Link
          href={props.href}
          target="_blank"
          rel="noopener noreferrer"
          className="paragraph-medium text-link-100"
        >
          {props.title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{props.title}</p>
      )}
    </div>
  );
}
