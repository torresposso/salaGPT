// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers } from "$fresh/server.ts";
import { State } from "@/routes/_middleware.ts";
import redirect from "@/lib/redirect.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async GET(req, ctx) {
    const { supabaseClient } = ctx.state;
    const url = new URL(req.url);
    const code = url.searchParams.get("code")!;

    const { data, error } = await supabaseClient.auth.exchangeCodeForSession(
      code,
    );
    return redirect("/", 303);
  },
};
