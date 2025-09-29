import Image from "next/image";
import {formatNumber} from "@/lib/utils";

type StatsProps = {
  totalQuestions: number;
  totalAnswers: number;
  badges: BadgeCounts;
  reputationPoints: number;
};

type BadgeCounts = {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
};

export function Stats(props: StatsProps) {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">
        Stats{" "}
        <span className="small-semibold primary-text-gradient">
          {formatNumber(props.reputationPoints)}
        </span>
      </h4>

      <div className="xs:grid-cols-2 mt-5 grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="light-border background-light900_dark300 shadow-light-300 dark:shadow-dark-200 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(props.totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>

          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(props.totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>

        <StatsCard
          image="/icons/gold-medal.svg"
          value={props.badges.GOLD}
          title="Gold Badges"
        />

        <StatsCard
          image="/icons/silver-medal.svg"
          value={props.badges.SILVER}
          title="Silver Badges"
        />

        <StatsCard
          image="/icons/bronze-medal.svg"
          value={props.badges.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
}

type StatsCardProps = {
  image: string;
  value: number;
  title: string;
};

function StatsCard(props: StatsCardProps) {
  return (
    <div className="light-border background-light900_dark300 shadow-light-300 dark:shadow-dark-200 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6">
      <Image
        src={props.image}
        alt="gold medal icon"
        width={40}
        height={50}
      />
      <div>
        <p className="paragraph-semibold text-dark200_light900">
          {props.value}
        </p>
        <p className="body-medium text-dark400_light700">{props.title}</p>
      </div>
    </div>
  );
}
