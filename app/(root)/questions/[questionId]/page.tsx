type PageQuestionProps = {
  params: Promise<{questionId: string}>;
};

async function PageQuestion(props: PageQuestionProps) {
  const params = await props.params;

  return <div>PageQuestion {params.questionId}</div>;
}

export default PageQuestion;
