export default function (api) {
    const currentlyPlaying = () => api.get("/dashboard/currentlyPlaying");
    const currentDevices = () => api.get("/dashboard/currentDevices");

    return {
        currentlyPlaying,
        currentDevices
    };
}
