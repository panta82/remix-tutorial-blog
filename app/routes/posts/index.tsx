import { useLoaderData } from "@remix-run/react";
import { Link } from "remix";
import { getPosts, IPost } from "~/post";

export const loader = () => {
  return getPosts();
};

export default function Posts() {
  const posts = useLoaderData<IPost[]>();
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
