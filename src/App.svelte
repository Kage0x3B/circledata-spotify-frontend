<script>
    import { _ } from "svelte-i18n";
    import { Router, Route } from "svelte-routing";
    import { Container } from "sveltestrap";
    import api from "./api/api";
    import { authInitialized, loggedIn } from "./stores";
    import Login from "./routes/Login.svelte";
    import MainNavbar from "./components/MainNavbar.svelte";
    import Dashboard from "./routes/Dashboard.svelte";
    import SpotifyCallback from "./routes/SpotifyCallback.svelte";

    if (!$authInitialized) {
        $authInitialized = true;
        $loggedIn = api.loadAuth();
    }
</script>

<Router basepath="/">
    <div class="mb-3">
        <MainNavbar />
    </div>

    <Container>
        <Route component={Dashboard} path="/" />
        <Route component={Login} path="/login" />
        <Route component={SpotifyCallback} path="/spotify-callback" />
    </Container>
</Router>

<style global src="../scss/main.scss"></style>
