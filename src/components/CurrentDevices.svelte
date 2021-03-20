<script>
    import { Card, Spinner, Row, Col } from "sveltestrap";
    import api from "../api/api.mjs";
    import { onMount } from "svelte";
    import { getDeviceIcon } from "../util/spotifyDeviceIcons.mjs";
    import Device from "./Device.svelte";

    let dataPromise;
    let data;

    onMount(() => {
        refreshData();

        const refreshIntervalHandle = setInterval(refreshData, 1000 * 60);

        return () => clearInterval(refreshIntervalHandle);
    });

    function refreshData() {
        dataPromise = api.dashboard.currentDevices().then(r => {
            data = r.data;
        });
    }
</script>

<Card class="px-3 py-4">
    <Row>
        <Col xs="12" md="3" lg="2" class="d-flex align-items-center mb-4 mb-md-0 justify-content-center justify-content-md-start">
            <h3>Meine <br class="d-none d-md-block" />Geräte</h3>
        </Col>
        <Col xs="12" md="9" lg="10">
            {#if data}
                {#if data.devices && data.devices.length}
                    <div class="device-list d-flex flex-row m-0 p-0 justify-content-around justify-content-md-start align-items-center">
                        {#each data.devices as device (device.id)}
                            <Device data={device} />
                        {/each}
                    </div>
                {:else}
                    <div class="d-flex justify-content-center align-items-center text-muted">
                        Keine Geräte verbunden
                    </div>
                {/if}
            {:else}
                <div class="d-flex align-items-center p-5">
                    <Spinner />
                </div>
            {/if}
        </Col>
    </Row>
</Card>

<style>
    .device-list {
        list-style: none;
        overflow-x: auto;
    }
</style>
