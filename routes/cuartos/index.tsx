// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import Layout from "@/islands/Layout.tsx";
import { State } from "@/routes/_middleware.ts";
import ImageUploader from "@/islands/ImageUploader.tsx";
import ImageGallery from "@/islands/ImageGallery.tsx";
import FileUpload from "@/islands/FileUpload.tsx";

export const handler: Handlers<any, State> = {
  async GET(_req, ctx) {
    const { supabaseClient, session } = ctx.state;
    const userId = session?.user.id;
    const user = {
      id: session?.user.id,
      avatar_url: session?.user.user_metadata.avatar_url || "",
      name: session?.user.user_metadata.name || "",
    };

    const { data, error } = await supabaseClient.storage.from("rooms_images")
      .list(
        session?.user.id,
      );
    const rooms = data?.map((file) => ({ roomId: file.name }));

    console.log("rooms", rooms);

    return ctx.render({ user, rooms });
  },
};

export default function Me({ data }: PageProps) {
  console.log("datapage", data);
  return (
    <Layout user={data.user}>
      <main class="text-white p-8">
        <div>
          hello {data.user.name}
        </div>
        <FileUpload />
      </main>
    </Layout>
  );
}
