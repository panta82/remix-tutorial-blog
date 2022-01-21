import libPath from "path";
import libFs from "fs/promises";
import invariant from "tiny-invariant";

import parseFrontMatter from "front-matter";
import { marked } from "marked";

const POSTS_PATH = libPath.resolve(__dirname, "../posts");

export interface IPost {
  slug: string;
  title: string;
}

export interface IPostWithContent extends IPost {
  content: string;
}

interface IPostMarkdownAttributes {
  title: string;
}
function isValidPostMarkdownAttributes(
  value: any
): value is IPostMarkdownAttributes {
  return value && typeof value === "object" && typeof value.title === "string";
}

async function readPostFromFile(
  filePath: string
): Promise<{ content: string; attributes: IPostMarkdownAttributes }> {
  const file = await libFs.readFile(filePath, "utf8");

  const parsed = parseFrontMatter(file.toString());
  invariant(
    isValidPostMarkdownAttributes(parsed.attributes),
    `Invalid post: ${filePath}`
  );

  return {
    content: parsed.body,
    attributes: parsed.attributes,
  };
}

export async function getPosts(): Promise<IPost[]> {
  const files = await libFs.readdir(POSTS_PATH);
  return Promise.all(
    files.map(async (fileName) => {
      const file = await readPostFromFile(
        libPath.resolve(POSTS_PATH, fileName)
      );

      return {
        slug: fileName.replace(/\.md$/, ""),
        title: file.attributes.title,
      };
    })
  );
}

export async function getPost(slug: string): Promise<IPostWithContent> {
  const path = libPath.join(POSTS_PATH, `${slug}.md`);
  const file = await readPostFromFile(path);
  const content = marked.parse(file.content);
  return {
    slug,
    title: file.attributes.title,
    content,
  };
}
