import "@supabase/postgrest-js";
import type { PostgrestBuilder, PostgrestSingleResponse } from "@supabase/postgrest-js";
import type { AsyncData, AsyncDataOptions } from "nuxt/app";

declare module "@supabase/postgrest-js" {
  interface PostgrestBuilder<Result> {
    asAsyncData(key: string, options?: AsyncDataOptions<PostgrestSingleResponse<Result>>): AsyncData<PostgrestSingleResponse<Result>, Error>;
  }
}

declare global {
    interface Function {
        asAsyncData<Result>(this: () => PostgrestBuilder<Result>, key: string, options?: AsyncDataOptions<PostgrestSingleResponse<Result>>): AsyncData<PostgrestSingleResponse<Result>, Error>;
    }
}
