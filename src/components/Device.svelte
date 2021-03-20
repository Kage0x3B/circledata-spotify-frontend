<script>
    import { getDeviceIcon } from "../util/spotifyDeviceIcons.mjs";

    export let data = {
        type: "",
        name: "",
        is_active: false
    };
</script>

<div class="d-flex flex-column mx-lg-4 justify-content-between">
    <div class="device-icon d-flex justify-content-center mb-2" class:active={data.is_active}>
        <svelte:component this={getDeviceIcon(data.type, data.is_active)} width="48" height="48" />
    </div>
    <div class="device-name">
        {data.name}
    </div>
</div>

<style>
    .device-name {
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: break-spaces;
    }

    .device-icon {
        color: var(--gray);
    }

    .device-icon.active {
        color: var(--primary);
    }
</style>
