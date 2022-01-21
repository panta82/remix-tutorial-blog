import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
  useTransition,
} from "remix";
import { createPost } from "~/post";

enum FormData {
  title = "title",
  slug = "slug",
  content = "content",
}

type IErrors = Partial<Record<FormData, string>>;

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title: string = formData.get(FormData.title)!?.toString();
  const slug = formData.get(FormData.slug)!?.toString();
  const content = formData.get(FormData.content)!?.toString();

  const errors: IErrors = {};
  if (!title) {
    errors[FormData.title] = "Title is required";
  }
  if (!slug) {
    errors[FormData.slug] = "Slug is required";
  }
  if (!content) {
    errors[FormData.content] = "Content is required";
  }
  if (Object.keys(errors)) {
    return errors;
  }

  await createPost({ title, slug, content });

  return redirect("/admin");
};

const ErrorMessage: React.FC<{
  field: FormData;
  errors: IErrors | undefined;
}> = ({ field, errors }) => {
  if (!errors || !errors[field]) {
    return null;
  }

  return (
    <div>
      <em>{errors[field]}</em>
    </div>
  );
};

export default function AdminNew() {
  const errors = useActionData<IErrors>();

  const transition = useTransition();

  return (
    <div>
      <h1>New post</h1>
      <Form method={"post"}>
        <p>
          <label>
            Post title: <input type={"text"} name={FormData.title} />
            <ErrorMessage field={FormData.title} errors={errors} />
          </label>
        </p>
        <p>
          <label>
            Post slug: <input type={"text"} name={FormData.slug} />
            <ErrorMessage field={FormData.slug} errors={errors} />
          </label>
        </p>
        <p>
          <label htmlFor={"markdown"}>Content (markdown):</label> <br />
          <textarea id={"markdown"} name={FormData.content} rows={20} />
          <ErrorMessage field={FormData.content} errors={errors} />
        </p>
        <p>
          <button type={"submit"} disabled={!!transition.submission}>
            Create post
          </button>
        </p>
      </Form>
    </div>
  );
}
