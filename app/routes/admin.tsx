import styles from "~/styles/admin.css";

import { Link, LinksFunction, LoaderFunction, Outlet } from "remix";
import { getPosts, IPost } from "~/post";
import { useLoaderData } from "@remix-run/react";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

export const loader: LoaderFunction = () => {
  return getPosts();
};

export default function Admin() {
  const posts = useLoaderData<IPost[]>();

  return (
    <div className={"Admin"}>
      <nav>
        <h1>Admin</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
