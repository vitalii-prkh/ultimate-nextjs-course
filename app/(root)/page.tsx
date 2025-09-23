import Link from "next/link";
import {ROUTES} from "@/refs/routes";
import {Button} from "@/components/ui/button";
import {LocalSearch} from "@/components/search/LocalSearch";
import {HomeTags} from "@/components/filters/HomeTags";
import {CardQuestion} from "@/components/cards/CardQuestion";

const questions = [
  {
    _id: "1",
    title: "How to use the app?",
    description: "The answer is",
    tags: [
      {
        _id: "1",
        name: "vue",
      },
      {
        _id: "2",
        name: "javascript",
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image: "/placeholders/150.jpeg",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "How to learn React?",
    description: "To learn React, you need to know JavaScript.",
    tags: [
      {
        _id: "1",
        name: "react",
      },
      {
        _id: "2",
        name: "typescript",
      },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image: "/placeholders/150.jpeg",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date().toISOString(),
  },
];

type PageHomeProps = {
  searchParams: Promise<{query?: string; tag?: string}>;
};

async function PageHome(props: PageHomeProps) {
  const {query = "", tag = ""} = await props.searchParams;
  const byText = (candidate: string, text: string) =>
    candidate.toLowerCase().includes(text.toLowerCase());
  const byTags = <Tag extends {name: string}>(tags: Tag[], text: string) =>
    tags.some((tag) => byText(tag.name, text));
  const filteredQuestions = questions.filter(
    (question) => byText(question.title, query) && byTags(question.tags, tag),
  );

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          asChild
          className="primary-gradient !text-light-900 min-h-[46px] px-4 py-3"
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.HOME}
          image="/icons/search.svg"
          placeholder="Search questions..."
          className="flex-1"
        />
      </section>
      <HomeTags />
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <CardQuestion
            key={question._id}
            data={question}
          />
        ))}
      </div>
    </>
  );
}

export default PageHome;
