import React from "react";
import markdownit from "markdown-it";
import DOMPurify from "dompurify";

type Props = {
  content: string;
};

const md = markdownit();

export default function Markdown({ content }: Props) {
  let htmlContent = "";
  try {
    htmlContent = md.render(content);
  } catch (error) {
    console.error("Error rendering Markdown:", error);
    // Optionally display an error message to the user
  }  

  const sanitized = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }}></div>;
}
