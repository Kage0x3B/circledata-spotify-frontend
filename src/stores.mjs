import {writable} from "svelte/store";

export let authInitialized = writable(false);
export let loggedIn = writable(false);
export let toasts = writable([]);
