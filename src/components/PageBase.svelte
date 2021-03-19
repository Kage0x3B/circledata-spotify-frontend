<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { Toast, ToastHeader, ToastBody } from "sveltestrap";
    import { navigate, links } from "svelte-routing";
    import { toasts, loggedIn } from "../stores";
    import InfoCircle from "svelte-bootstrap-icons/lib/InfoCircle";
    import ExclamationTriangle from "svelte-bootstrap-icons/lib/ExclamationTriangle";
    import ExclamationCircle from "svelte-bootstrap-icons/lib/ExclamationCircle";

    export let requiresAuthorization = true;

    const dispatch = createEventDispatcher();

    let toastIdCounter = 0;

    onMount(() => {
        if (requiresAuthorization && !$loggedIn) {
            navigate("/login", { replace: true });

            return;
        }

        const intervalId = setInterval(updateToasts, 1000);

        return () => {
            clearInterval(intervalId);
        };
    });

    function updateToasts() {
        $toasts = $toasts.filter(t => Date.now() - t.created <= t.duration);
    }

    export function showToast(options) {
        const defaultOptions = {
            id: toastIdCounter++,
            title: "",
            message: "",
            duration: 5000,
            icon: null,
            iconClasses: "",
            created: Date.now()
        };

        const toast = Object.assign({}, defaultOptions, options);

        $toasts.push(toast);
    }

    export function showInfo(message) {
        showToast({
            title: "Info",
            message,
            iconClasses: "text-info",
            icon: InfoCircle
        });
    }

    export function showWarning(message) {
        showToast({
            title: "Achtung",
            message,
            iconClasses: "text-warning",
            icon: ExclamationTriangle
        });
    }

    export function showError(message) {
        showToast({
            title: "Fehler",
            message,
            iconClasses: "text-danger",
            icon: ExclamationCircle
        });
    }
</script>

<div use:links>
    <slot />
</div>

<div class="toast-container">
    {#each $toasts as toast (toast.id)}
        <Toast>
            {#if toast.title}
                <ToastHeader>
                    <div slot="icon" class="mr-2 {toast.iconClasses}">
                        {#if toast.icon}
                            <svelte:component this={toast.icon} />
                        {/if}
                    </div>
                    {@html toast.title}
                </ToastHeader>
            {/if}
            {#if toast.message}
                <ToastBody>
                    {@html toast.message}
                </ToastBody>
            {/if}
        </Toast>
    {/each}
</div>

<style>
    .toast-container {
        position: fixed;
        bottom: 10px;
        right: 10px;
    }
</style>
