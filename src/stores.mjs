import { writable, readable } from "svelte/store";

export const authInitialized = writable(false);
export const loggedIn = writable(false);
export const toasts = writable([]);
export const time = readable(new Date(), function start(set) {
    const interval = setInterval(() => {
        set(new Date());
    }, 1000);

    return function stop() {
        clearInterval(interval);
    };
});
