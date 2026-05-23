import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build/static generation, env vars may not be set.
  // Return a graceful fallback that won't throw.
  if (!supabaseUrl || !supabaseKey) {
    return createSafeFallback();
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Handle edge case in Server Components
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // Handle edge case in Server Components
        }
      },
    },
  });
}

// Return a client-like object that returns empty data for all queries
function createSafeFallback() {
  const emptyResult = { data: [], error: null };
  const handler = {
    get(_: any, prop: string) {
      if (prop === "auth") {
        return new Proxy({}, {
          get() { return () => Promise.resolve({ data: { user: null }, error: null }); },
        });
      }
      if (prop === "storage") {
        return new Proxy({}, {
          get() { return () => Promise.resolve({ data: null, error: null }); },
        });
      }
      if (prop === "from") {
        return () => createSafeQueryBuilder();
      }
      if (prop === "rpc") {
        return () => ({
          single: () => Promise.resolve(emptyResult),
          then: (resolve: any) => Promise.resolve(emptyResult).then(resolve),
        });
      }
      return () => Promise.resolve(emptyResult);
    },
  };

  return new Proxy({}, handler);
}

function createSafeQueryBuilder(): any {
  const emptyResult = { data: [], error: null };
  const singleResult = { data: null, error: null };

  const builder: any = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    upsert: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    like: () => builder,
    ilike: () => builder,
    is: () => builder,
    in: () => builder,
    contains: () => builder,
    or: () => builder,
    order: () => builder,
    limit: () => builder,
    range: () => builder,
    single: () => Promise.resolve(singleResult),
    maybeSingle: () => Promise.resolve(singleResult),
    then: (resolve: any) => Promise.resolve(emptyResult).then(resolve),
  };

  return builder;
}
