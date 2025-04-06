import { PostgrestClient } from "@supabase/postgrest-js";
import { defineNuxtPlugin, useAsyncData } from "nuxt/app";

export default defineNuxtPlugin((_) => {
    const supabase = new PostgrestClient("https://dummy.com");
    const tempQueryFunction = () => supabase.from("_temp").select("*");
    const queryProtoFunction = Object.getPrototypeOf(tempQueryFunction);
    if (queryProtoFunction && !queryProtoFunction.asAsyncData) {
        queryProtoFunction.asAsyncData = function (key: string, options = {}) {
            return useAsyncData(key, () => this(), options);
        };
    }
    const tempQueryObject = supabase.from("_temp").select("*");
    const queryProtoObject = Object.getPrototypeOf(tempQueryObject);
    if (queryProtoObject && !queryProtoObject.asAsyncData) {
        queryProtoObject.asAsyncData = function (key: string, options = {}) {
            return useAsyncData(key, () => this, options);
        };
    }
});
