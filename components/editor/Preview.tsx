import {Code} from "bright";
import {MDXRemote} from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  light_dimmed: "html.light",
};

type PreviewProps = {
  content: string;
};

export function Preview({content}: PreviewProps) {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

  return (
    <section className="markdown prose grid break-words">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
}
