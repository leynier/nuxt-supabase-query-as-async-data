import { defineNuxtPlugin } from "nuxt/app";
import { applyPatch } from "./patch";

export default defineNuxtPlugin(() => {
    applyPatch();
});
