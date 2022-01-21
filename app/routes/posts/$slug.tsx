import { useLoaderData } from "@remix-run/react";
import { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import { getPost, IPost, IPostWithContent } from "~/post";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "slug is required");
  return getPost(params.slug);
};

export default function PostSlug() {
  const post = useLoaderData<IPostWithContent>();

  return (
    <div>
      <h1>{post.title}</h1>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
