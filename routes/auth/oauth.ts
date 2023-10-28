// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import redirect from "@/lib/redirect.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    const { supabaseClient } = ctx.state;

    const { origin } = new URL(req.url);

    console.log("origin", origin);
    const { data, error } = await supabaseClient.auth.signInWithOAuth(
      {
        provider: "google",
        options: {
          redirectTo: origin + "/auth/success",
        },
      },
    );

    if (error) throw error;

    return redirect(data.url);
  },
};
