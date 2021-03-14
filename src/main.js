import { addMessages, init, getLocaleFromNavigator } from "svelte-i18n";

import App from "./App.svelte";

import langDe from "../i18n/de.json";

if (appEnv.DEV) {
    eruda.init();
}

addMessages("de", langDe);

init({
    fallbackLocale: "de",
    initialLocale: getLocaleFromNavigator()
});

const app = new App({
    target: document.body
});

export default app;
