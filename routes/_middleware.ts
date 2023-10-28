import type { MiddlewareHandlerContext } from "$fresh/server.ts";
import { createServerClient } from "@/lib/supabase.ts";
import type { Session } from "@supabase/supabase-js";

export interface State {
  session: Session | null;
  supabaseClient: ReturnType<typeof createServerClient>;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext,
) {
  const { pathname } = new URL(req.url);

  if (
    pathname.includes("/auth/signout") || pathname.includes("_frsh") ||
    pathname.includes(".ico")
  ) {
    return ctx.next();
  }
  const headers = new Headers();

  const supabaseClient = createServerClient({ req, resHeaders: headers });
  const { data: { session } } = await supabaseClient.auth.getSession();

  ctx.state.session = session;
  ctx.state.supabaseClient = supabaseClient;

  const response = await ctx.next();
  /**
   * Note: ensure that a `new Response()` with a `location` header is used when performing server-side redirects.
   * Using `Response.redirect()` will throw as its headers are immutable.
   */
  headers.forEach((value, key) => response.headers.append(key, value));
  return response;
}
