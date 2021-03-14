<script>
    import { _ } from "svelte-i18n";
    import { Router, Route } from "svelte-routing";
    import { Container } from "sveltestrap";
    import api from "./api/api";
    import { authInitialized, loggedIn } from "./stores";

    if (!$authInitialized) {
        $authInitialized = true;
        $loggedIn = api.loadAuth();
    }
</script>

<Router basepath="/">
    <div class="mb-3">
        <!--<MainNavbar />-->
    </div>

    <Container>
        <Route path="/">
            Index
        </Route>
    </Container>
</Router>

<style global src="../scss/main.scss"></style>
