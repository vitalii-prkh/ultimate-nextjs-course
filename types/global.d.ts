type EntityQuestion = {
  _id: string;
  title: string;
  description: string;
  tags: EntityTag[];
  author: EntityAuthor;
  upvotes: number;
  answers: number;
  views: number;
  createdAt: string;
};

type EntityTag = {
  _id: string;
  name: string;
};

type EntityAuthor = {
  _id: string;
  name: string;
  image: string;
};
