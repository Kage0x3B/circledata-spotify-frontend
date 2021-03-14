export default function (api) {
    const login = (pin) =>
        api.axios.post("/auth/login/worker", {
            username: pin
        });
    const logout = () => api.axios.post("/auth/logout");
    const refresh = (refreshToken) => api.axios.post("/auth/refresh", { refreshToken });
    const check = () => api.get("/auth/check");

    return {
        login,
        logout,
        refresh,
        check
    };
}
