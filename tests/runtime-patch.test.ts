import { beforeEach, describe, expect, it, vi } from "vitest";

const { useAsyncData } = vi.hoisted(() => ({ useAsyncData: vi.fn() }));

vi.mock("nuxt/app", () => ({
    useAsyncData: (...args: unknown[]) => useAsyncData(...args),
    defineNuxtPlugin: (plugin: unknown) => plugin,
}));

import { PostgrestBuilder, PostgrestClient } from "@supabase/postgrest-js";
import plugin from "../src/runtime/plugin";
import { applyPatch } from "../src/runtime/patch";

interface User {
    id: number;
    name: string;
}

type Database = {
    public: {
        Tables: {
            users: {
                Row: User;
                Insert: User;
                Update: Partial<User>;
                Relationships: [];
            };
        };
        Views: {};
        Functions: {
            get_users: { Args: Record<string, never>; Returns: User[] };
        };
    };
};

function createClient() {
    return new PostgrestClient<Database>("https://example.supabase.co/rest/v1", {
        fetch: vi.fn(),
    });
}

describe("applyPatch", () => {
    beforeEach(() => {
        useAsyncData.mockReset();
    });

    it("defines asAsyncData on PostgrestBuilder.prototype", () => {
        applyPatch();

        expect(typeof PostgrestBuilder.prototype.asAsyncData).toBe("function");
    });

    it("defines asAsyncData as non-enumerable, writable and configurable", () => {
        applyPatch();

        const descriptor = Object.getOwnPropertyDescriptor(
            PostgrestBuilder.prototype,
            "asAsyncData",
        );

        expect(descriptor).toBeDefined();
        expect(descriptor?.enumerable).toBe(false);
        expect(descriptor?.writable).toBe(true);
        expect(descriptor?.configurable).toBe(true);
    });

    it("is idempotent (does not redefine the method)", () => {
        applyPatch();

        const before = PostgrestBuilder.prototype.asAsyncData;

        applyPatch();

        expect(PostgrestBuilder.prototype.asAsyncData).toBe(before);
    });

    it("does not pollute Function.prototype", () => {
        applyPatch();

        expect("asAsyncData" in Function.prototype).toBe(false);

        function query() {
            return createClient().from("users").select("*");
        }

        expect((query as unknown as Record<string, unknown>).asAsyncData).toBeUndefined();
        expect("asAsyncData" in query).toBe(false);
    });

    it("exposes asAsyncData on query, filter, transform and rpc builders", () => {
        const client = createClient();

        const select = client.from("users").select("*");
        const filtered = client.from("users").select("*").eq("id", 1);
        const ordered = client.from("users").select("*").order("id");
        const single = client.from("users").select("*").single();
        const rpc = client.rpc("get_users");

        for (const builder of [select, filtered, ordered, single, rpc]) {
            expect(typeof (builder as { asAsyncData?: unknown }).asAsyncData).toBe("function");
        }
    });

    it("asAsyncData delegates to useAsyncData with the key and the builder", () => {
        const client = createClient();
        const builder = client.from("users").select("*").eq("id", 1);

        const marker = { data: "async-data" };
        useAsyncData.mockReturnValue(marker);

        const options = { lazy: true };
        const result = builder.asAsyncData("users-query", options);

        expect(result).toBe(marker);
        expect(useAsyncData).toHaveBeenCalledTimes(1);
        expect(useAsyncData).toHaveBeenCalledWith("users-query", expect.any(Function), options);

        const handler = useAsyncData.mock.calls[0]![1] as () => unknown;
        expect(handler()).toBe(builder);
    });

    it("asAsyncData defaults options to an empty object", () => {
        const client = createClient();
        const builder = client.from("users").select("*");

        builder.asAsyncData("users-query");

        expect(useAsyncData).toHaveBeenCalledWith("users-query", expect.any(Function), {});
    });

    it("the builder passed to useAsyncData can be awaited and resolves via fetch", async () => {
        const fetchMock = vi.fn().mockResolvedValue(
            new Response(JSON.stringify([{ id: 1, name: "Alice" }]), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }),
        );
        const client = new PostgrestClient<Database>("https://example.supabase.co/rest/v1", {
            fetch: fetchMock,
        });
        const builder = client.from("users").select("*").eq("id", 1);

        builder.asAsyncData("users-query");

        const handler = useAsyncData.mock.calls[0]![1] as () => unknown;
        const response = (await handler()) as { data: Array<{ id: number }>; error: null };

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(response.error).toBeNull();
        expect(response.data).toEqual([{ id: 1, name: "Alice" }]);
    });
});

describe("plugin", () => {
    it("applies the patch when the plugin runs", () => {
        expect((plugin as (nuxtApp: unknown) => void)({})).toBeUndefined();

        expect(typeof PostgrestBuilder.prototype.asAsyncData).toBe("function");
    });
});
