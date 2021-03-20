<script>
    import { Container, Row, Col, Card, Form, FormGroup, Label, Input, Button } from "sveltestrap";
    import { navigate } from "svelte-routing";
    import PageBase from "../components/PageBase.svelte";
    import api from "../api/api";
    import { loggedIn } from "../stores";

    let pageUtil;

    async function login(e) {
        e.preventDefault();

        try {
            const res = await api.auth.createSpotifyAuthUrl();

            console.log(res.data);
            navigate(res.data.url);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                pageUtil.showWarning("PIN stimmt nicht");
            } else {
                console.log(err);
                pageUtil.showError("Es ist ein Fehler aufgetreten");
            }
        }
    }
</script>

<PageBase bind:this={pageUtil} requiresAuthorization={false}>
    <Container>
        <Row>
            <Col lg={{size: 6, offset: 3}} md={{size: 8, offset: 2}} xs="12">
                <Card class="p-4">
                    <Form on:submit={login}>
                        <Button block color="primary" large type="submit">
                            <img alt="Spotify Logo" class="mr-2" src="/assets/img/spotify-white-64.png" /><!---->
                            <span class="font-weight-bolder">Login With Spotify</span>
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    </Container>
</PageBase>

<style>
    img {
        width: auto;
        height: 32px;
    }
</style>
