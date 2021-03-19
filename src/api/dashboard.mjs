export default function (api) {
    const currentlyPlaying = () => api.get("/dashboard/currentlyPlaying");

    return {
        currentlyPlaying
    };
}
