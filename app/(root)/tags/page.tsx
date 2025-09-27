import {getTags} from "@/lib/actions/tag.actions";

async function PageTags() {
  const {success, data, error} = await getTags({
    page: 1,
    pageSize: 10,
    query: "",
  });

  console.log(success, data, error);

  return <div>PageTags</div>;
}

export default PageTags;
