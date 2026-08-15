import { PostgrestBuilder } from "@supabase/postgrest-js";
import { useAsyncData } from "nuxt/app";

/**
 * Adds an `asAsyncData` method to `PostgrestBuilder.prototype` so every
 * PostgREST query builder (filter, transform, single, rpc, ...) can be
 * converted into a Nuxt `useAsyncData()` call.
 */
export function applyPatch(): void {
    const prototype = PostgrestBuilder.prototype as any;

    if ("asAsyncData" in prototype) {
        return;
    }

    Object.defineProperty(prototype, "asAsyncData", {
        enumerable: false,
        writable: true,
        configurable: true,
        value: function (this: any, key: string, options = {}) {
            return useAsyncData(key, () => this, options);
        },
    });
}
