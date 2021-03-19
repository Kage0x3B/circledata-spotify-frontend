export default function (api) {
    const authorize = (code, state) => api.axios.post("/auth/authorize", { code, state });
    const logout = () => api.axios.post("/auth/logout");
    const refresh = (refreshToken) => api.axios.post("/auth/refresh", { refreshToken });
    const check = () => api.get("/auth/check");
    const createSpotifyAuthUrl = () => api.axios.get("/auth/createSpotifyAuthUrl");

    return {
        authorize,
        logout,
        refresh,
        check,
        createSpotifyAuthUrl
    };
}
