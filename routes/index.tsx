import { Head } from "$fresh/runtime.ts";
import SquigglyLines from "@/components/SquigglyLines.tsx";
import Layout from "@/islands/Layout.tsx";
import { State } from "@/routes/_middleware.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers<unknown, State> = {
  GET(_req, ctx) {
    const { session } = ctx.state;

    let user;

    if (session) {
      console.log(session);
      user = {
        id: session?.user.id,
        avatar_url: session?.user.user_metadata.avatar_url || "",
        name: session?.user.user_metadata.name || "",
      };
    }

    return ctx.render({ user });
  },
};

export default function Home({ data }: PageProps) {
  return (
    <>
      <Head>
        <title>Cuartify</title>
      </Head>
      <Layout user={data.user}>
        <Main />
      </Layout>
    </>
  );
}

const Main = () => {
  return (
    <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 mt-20">
      <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-7xl">
        Generating dream rooms{" "}
        <span className="relative whitespace-nowrap text-blue-600">
          <SquigglyLines />
          <span className="relative">using AI</span>
        </span>{" "}
        for everyone.
      </h1>
      <h2 className="mx-auto mt-12 max-w-xl text-lg sm:text-gray-400  text-gray-500 leading-7">
        Take a picture of your room and see how your room looks in different
        themes. 100% free – remodel your room today.
      </h2>
      <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
        <div className="flex flex-col space-y-10 mt-4 mb-16">
          <div className="flex sm:space-x-8 sm:flex-row flex-col">
            <div>
              <h3 className="mb-1 font-medium text-lg">Original Room</h3>
              <img
                alt="Original photo of a room with roomGPT.io"
                src=""
                className="w-full object-cover h-96 rounded-2xl border"
                width={400}
                height={400}
              />
            </div>
            <div className="sm:mt-0 mt-8">
              <h3 className="mb-1 font-medium text-lg">Generated Room</h3>
              <img
                alt="Generated photo of a room with roomGPT.io"
                width={400}
                height={400}
                src=""
                className="w-full object-cover h-96 rounded-2xl sm:mt-0 mt-2 border"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
