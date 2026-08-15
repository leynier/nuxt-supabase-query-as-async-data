import { describe, expect, it } from "vitest";

import module from "../src/module";

describe("module", () => {
    it("exposes the expected module metadata", async () => {
        const meta = await module.getMeta!();

        expect(meta.name).toBe("nuxt-supabase-query-as-async-data");
        expect(meta.configKey).toBe("supabaseQueryAsAsyncData");
        expect(meta.compatibility).toEqual({
            nuxt: "^3.0.0 || ^4.0.0",
        });
    });
});
