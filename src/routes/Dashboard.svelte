<script>
    import { Container, Row, Col, Card, Form, FormGroup, Label, Input, Button } from "sveltestrap";
    import { navigate } from "svelte-routing";
    import PageBase from "../components/PageBase.svelte";
    import api from "../api/api";
    import { loggedIn } from "../stores";
    import CurrentlyPlaying from "../components/CurrentlyPlaying.svelte";

    let displayName = api.getDisplayName();
    let profilePictureUrl = api.getProfilePictureUrl();

    let pageUtil;
</script>

<PageBase bind:this={pageUtil}>
    <Container>
        <Row class="mb-5">
            <Col class="d-flex align-items-center">
                <img alt="Spotify profile picture" class="profile-picture rounded-circle mr-3" src={profilePictureUrl} />
                <h3>{displayName}'s CircleData Dashboard</h3>
            </Col>
        </Row>
        <Row>
            <Col>
                <CurrentlyPlaying />
            </Col>
        </Row>
    </Container>
</PageBase>
