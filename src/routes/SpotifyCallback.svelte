<script>
    import { Container, Row, Col, Card, Form, FormGroup, Label, Input, Button, Spinner } from "sveltestrap";
    import { navigate } from "svelte-routing";
    import PageBase from "../components/PageBase.svelte";
    import api from "../api/api";
    import { loggedIn } from "../stores";
    import { onMount } from "svelte";

    let pageUtil;

    onMount(authorizeUser)

    async function authorizeUser() {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get("code");
        const state = urlParams.get("state");
        const error = urlParams.get("error");

        if (error) {
            console.warn("Could not authorize with spotify, error:", error);
            pageUtil.showError("Spotify Login fehlgeschlagen, bitte versuche es erneut.");

            return navigate("/login", { replace: true });
        }

        if (!authCode || !state) {
            return navigate("/login", { replace: true });
        }

        const res = await api.auth.authorize(authCode, state);

        api.updateAuth(res.data);
        $loggedIn = true;
        navigate("/", { replace: true });
    }
</script>

<PageBase bind:this={pageUtil} requiresAuthorization={false}>
    <Container>
        <Row>
            <Col lg={{size: 6, offset: 3}} md={{size: 8, offset: 2}} xs="12">
                <Card class="p-4">
                    <div class="d-flex justify-content-center align-items-center">
                        <Spinner class="mr-3" color="primary" />
                        Logging you in...
                    </div>
                </Card>
            </Col>
        </Row>
    </Container>
</PageBase>
