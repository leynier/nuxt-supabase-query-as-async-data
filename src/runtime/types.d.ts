import type {
    PostgrestClientOptions,
    PostgrestResponseSuccess,
    PostgrestSingleResponse,
} from "@supabase/postgrest-js";
import type { AsyncData, AsyncDataOptions, NuxtError } from "nuxt/app";

/**
 * The value a builder resolves to when awaited.
 *
 * Note: the second type parameter must be named `Result$1` (and every other
 * type parameter name, constraint and default must match) to satisfy
 * TypeScript's identical-type-parameter-lists rule for class/interface
 * declaration merging. The names come from the bundled declarations of
 * `@supabase/postgrest-js` v2.
 */
type PostgrestBuilderResponse<Result, ThrowOnError extends boolean> =
    ThrowOnError extends true ? PostgrestResponseSuccess<Result> : PostgrestSingleResponse<Result>;

declare module "@supabase/postgrest-js" {
    interface PostgrestBuilder<
        ClientOptions extends PostgrestClientOptions,
        Result$1,
        ThrowOnError extends boolean = false,
    > {
        /**
         * Wraps this query into Nuxt's `useAsyncData()` using the given key.
         *
         * @example
         * const { data, error, status, refresh } = supabase
         *   .from('users')
         *   .select('*')
         *   .asAsyncData('users-query')
         */
        asAsyncData(
            key: string,
            options?: AsyncDataOptions<PostgrestBuilderResponse<Result$1, ThrowOnError>>,
        ): AsyncData<
            PostgrestBuilderResponse<Result$1, ThrowOnError> | undefined,
            NuxtError | undefined
        >;
    }
}

export {};
