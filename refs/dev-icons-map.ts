export const DEV_ICONS_MAP: Record<string, string> = {
  // JavaScript variations
  javascript: "devicon-javascript-plain",
  js: "devicon-javascript-plain",

  // TypeScript variations
  typescript: "devicon-typescript-plain",
  ts: "devicon-typescript-plain",

  // React variations
  react: "devicon-react-original",
  reactjs: "devicon-react-original",

  // Next.js variations
  nextjs: "devicon-nextjs-plain",
  next: "devicon-nextjs-plain",

  // Node.js variations
  nodejs: "devicon-nodejs-plain",
  node: "devicon-nodejs-plain",

  // Bun.js variations
  bun: "devicon-bun-plain",
  bunjs: "devicon-bun-plain",

  // Deno.js variations
  deno: "devicon-denojs-original",
  denojs: "devicon-denojs-plain",

  // Python variations
  python: "devicon-python-plain",

  // Java variations
  java: "devicon-java-plain",

  // C++ variations
  "c++": "devicon-cplusplus-plain",
  cpp: "devicon-cplusplus-plain",

  // C# variations
  "c#": "devicon-csharp-plain",
  csharp: "devicon-csharp-plain",

  // PHP variations
  php: "devicon-php-plain",

  // HTML variations
  html: "devicon-html5-plain",
  html5: "devicon-html5-plain",

  // CSS variations
  css: "devicon-css3-plain",
  css3: "devicon-css3-plain",

  // Git variations
  git: "devicon-git-plain",

  // Docker variations
  docker: "devicon-docker-plain",

  // MongoDB variations
  mongodb: "devicon-mongodb-plain",
  mongo: "devicon-mongodb-plain",

  // MySQL variations
  mysql: "devicon-mysql-plain",

  // PostgreSQL variations
  postgresql: "devicon-postgresql-plain",
  postgres: "devicon-postgresql-plain",

  // AWS variations
  aws: "devicon-amazonwebservices-original",
  "amazon web services": "devicon-amazonwebservices-original",

  // Tailwind CSS variations
  tailwind: "devicon-tailwindcss-original",
  tailwindcss: "devicon-tailwindcss-original",
} as const;

export const DEV_DESC_MAP: Record<string, string> = {
  javascript:
    "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
  typescript:
    "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
  react:
    "React is a popular library for building fast, component-based user interfaces and web applications.",
  nextjs:
    "Next.js is a React framework for building fast, SEO-friendly, and production-grade web applications.",
  nodejs:
    "Node.js is a runtime for building fast and scalable server-side applications using JavaScript.",
  python:
    "Python is a beginner-friendly language known for its versatility and simplicity in various fields.",
  java: "Java is a versatile, cross-platform language widely used in enterprise and Android development.",
  "c++":
    "C++ is a high-performance language ideal for system programming, games, and large-scale applications.",
  git: "Git is a version control system that helps developers track changes and collaborate on code efficiently.",
  docker:
    "Docker simplifies app deployment by containerizing environments, ensuring consistency across platforms.",
  mongodb:
    "MongoDB is a flexible NoSQL database ideal for handling unstructured data and scalable applications.",
  mysql:
    "MySQL is a popular open-source relational database management system known for its stability and performance.",
  postgresql:
    "PostgreSQL is a powerful open-source SQL database known for its scalability and robustness.",
  aws: "Amazon Web Services (AWS) is a cloud computing platform that offers a wide range of services for building, deploying, and managing web and mobile applications.",
} as const;
