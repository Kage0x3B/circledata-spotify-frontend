import axios from "axios";
import jwtDecode from "jwt-decode";
import { navigate } from "svelte-routing";

import { loggedIn } from "../stores";
import storage from "../storage";

import Auth from "./auth";

const API_BASE = appEnv.API_BASE;

const DEBUG = appEnv.API_DEBUG;

const axiosInstance = axios.create({
    baseURL: API_BASE
});

axiosInstance.interceptors.response.use(
    function (response) {
        if (DEBUG) {
            console.log(response);
        }

        return response;
    },
    function (error) {
        if (DEBUG) {
            try {
                console.log(error.toJSON());
            } catch (ex) {
                console.log(error.toString());
                console.log(error.stack ? error.stack : "-");
                console.log(error.name ? error.name : "-");
                console.log(error.message ? error.message : "-");
                console.log(error.at ? error.at : "-");
                console.log(error.text ? error.text : "-");
            }
        }

        return Promise.reject(error);
    }
);

let authData = {
    jwtToken: "",
    refreshToken: ""
};
let additionalData = {
    tokenExpiration: 0,
    userId: -1
};

function updateAuth(_authData) {
    authData = _authData;

    if (DEBUG && authData.jwtToken) {
        console.log(authData);
        console.log("Update Auth Token");
        console.log(authData.jwtToken);
        console.log(jwtDecode(authData.jwtToken));
    }

    if (authData.jwtToken) {
        const tokenData = jwtDecode(authData.jwtToken);
        additionalData.tokenExpiration = tokenData.exp;
        additionalData.userId = tokenData.id;

        axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + authData.jwtToken;
    } else {
        axiosInstance.defaults.headers.common["Authorization"] = "";
        additionalData.userId = -1;
    }

    storage.storeAuth(getAuth());
}

function getAuth() {
    return authData;
}

function getUserId() {
    return additionalData.userId;
}

function loadAuth() {
    const authData = storage.getAuth();

    if (authData && authData.jwtToken) {
        updateAuth(authData);

        return true;
    }

    return false;
}

function hasValidAuth() {
    return authData && authData.jwtToken && additionalData.tokenExpiration * 1000 > Date.now() + 2000;
}

function optParam(param, defaultValue) {
    /* Is used to reuse api endpoints (/article/list/1 || /article/list/)*/
    return param ? param : defaultValue ? defaultValue : "";
}

const apiUtilities = {
    axios: axiosInstance,
    get,
    post,
    optParam
};

const authApi = Auth(apiUtilities);

async function refreshAuth() {
    console.log("Refreshing auth");
    try {
        const response = await authApi.refresh(authData.refreshToken);
        updateAuth(response.data);
    } catch (e) {
        if (e.response && e.response.status === 401) {
            // Unauthorized -> Refresh token expired
            console.log("Refresh token expired");
            logout();
            //TODO: UX: Send toast message to explain logout to user?
        }
    }
}

function logout() {
    try {
        authApi.logout();
    } catch (ex) {
        console.log(ex);
    }

    updateAuth({});
    loggedIn.set(false);
    navigate("/login", { replace: true });
}

function performRequest(requestFunc) {
    return new Promise(async function (resolve, reject) {
        try {
            if (!hasValidAuth()) {
                console.log("Expired auth");
                await refreshAuth();
            }

            try {
                resolve(await requestFunc());
            } catch (error) {
                console.log(error);

                if (!error.response || error.response.status !== 401) {
                    reject(error);

                    return;
                }

                console.log("Expired auth unnoticed");

                await refreshAuth();

                resolve(await requestFunc());
            }
        } catch (error) {
            reject(error);
        }
    });
}

function get(url, config) {
    return performRequest(() => axiosInstance.get(url, config));
}

function post(url, body, config) {
    return performRequest(() => axiosInstance.post(url, body, config));
}

export default {
    baseUrl: API_BASE,
    auth: authApi,
    apiUtilities,
    loadAuth,
    getAuth,
    updateAuth,
    logout,
    getUserId
};
