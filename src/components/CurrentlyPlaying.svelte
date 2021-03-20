<script>
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { Card, Spinner } from "sveltestrap";
    import api from "../api/api.mjs";
    import { time } from "../stores.mjs";
    import { leftPadZero } from "../util/util.mjs";
    import { onMount } from "svelte";

    let dataPromise;
    let data;
    let refreshTimestamp;

    let playbackCurrentMinute = 0;
    let playbackCurrentSecond = 0;
    let playbackLengthMinutes = 0;
    let playbackLengthSeconds = 0;
    const playbackPercent = tweened(0, {
        duration: 400,
        easing: cubicOut
    });

    onMount(() => {
        refreshData();

        const refreshIntervalHandle = setInterval(refreshData, 1000 * 20);

        return () => clearInterval(refreshIntervalHandle);
    });

    function refreshData() {
        dataPromise = api.dashboard.currentlyPlaying().then(r => {
            refreshTimestamp = Date.now();
            data = r.data;
        });
    }

    function recalculatePlaybackStatus() {
        if (!data.is_playing) {
            $playbackPercent = 0;

            return;
        }

        let currentPlaybackMs = data.progress_ms + ($time.getTime() - refreshTimestamp);

        let playbackCurrentSeconds = Math.round(currentPlaybackMs / 1000);
        let playbackLength = Math.round(data.item.duration_ms / 1000);

        playbackCurrentMinute = Math.floor(playbackCurrentSeconds / 60);
        playbackCurrentSecond = playbackCurrentSeconds % 60;

        playbackLengthMinutes = Math.floor(playbackLength / 60);
        playbackLengthSeconds = playbackLength % 60;

        $playbackPercent = (currentPlaybackMs / data.item.duration_ms) * 100.0;
    }

    $: if (data && $time) {
        recalculatePlaybackStatus();

        if ($playbackPercent > 100) {
            refreshData();
        }
    }
</script>

<Card class="p-0 border-0 text-white currently-playing-card d-flex flex-row" color="dark">
    {#if data}
        {#if data.item.album && data.item.album.images.length}
            <div class="album-cover">
                <picture>
                    {#each data.item.album.images as albumCoverImg (albumCoverImg.url)}
                        <source srcset={albumCoverImg.url} media="(min-width: {albumCoverImg.width}px)">
                    {/each}<!---->
                    <img src={data.item.album.images[0].url} alt={data.item.album.name}>
                </picture>
            </div>
            <div class="info-container d-inline-flex flex-column justify-content-between w-100 h-100">
                <div class="p-3">
                    <div class="overflow-ellipsis">
                        <strong><a href={data.item.external_urls.spotify} target="_blank">{data.item.name}</a></strong>
                    </div>
                    <div class="overflow-ellipsis">
                        {#each data.item.artists as artist, i}
                            <span><a href={artist.external_urls.spotify} target="_blank">{artist.name}</a>{i < data.item.artists.length - 1 ? ", " : ""}</span>
                        {/each}
                    </div>
                    {#if data.playlist}
                        <div class="overflow-ellipsis">
                            <a href={data.playlist.external_urls.spotify} target="_blank" title={data.playlist.description}>{data.playlist.name}</a>
                        </div>
                    {:else}
                        <div class="overflow-ellipsis">
                            <a href={data.item.album.external_urls.spotify} target="_blank">{data.item.album.name}</a>
                        </div>
                    {/if}
                </div>
                <div class="music-progress-bar-container d-flex align-items-end">
                    <div class="music-progress-bar d-flex align-items-center" style="width: {$playbackPercent}%"></div>
                    <span class="ml-2">
                        {leftPadZero(playbackCurrentMinute, 2)}:{leftPadZero(playbackCurrentSecond, 2)} / {leftPadZero(playbackLengthMinutes, 2)}:{leftPadZero(playbackLengthSeconds, 2)}
                    </span>
                </div>
            </div>
        {/if}
    {:else}
        <div class="d-flex align-items-center p-5">
            <Spinner />
        </div>
    {/if}
</Card>

<style>
    :global(.currently-playing-card) {
        height: 128px;
        border-top-left-radius: 25px;
        border-bottom-left-radius: 25px;
    }

    :global(.currently-playing-card) a {
        color: var(--white);
    }

    .album-cover {
        width: auto;
        height: 100%;
    }

    .album-cover img {
        height: 100%;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }

    .info-container {
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        overflow: hidden;
    }

    .overflow-ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .music-progress-bar-container {
        width: 100%;
        height: 20px;
    }

    .music-progress-bar {
        background-color: var(--primary);
        width: 100%;
        height: 3px;
        transition: height 0.4s;
    }

    .music-progress-bar-container span {
        position: absolute;
        opacity: 0;
        font-size: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: fade;
        transition: opacity 0.4s;
    }

    .music-progress-bar-container:hover .music-progress-bar {
        height: 100%;
    }

    .music-progress-bar-container:hover span {
        opacity: 1;
    }
</style>
