<script>
    import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "sveltestrap";
    import { links } from "svelte-routing";

    import api from "../api/api";
    import { loggedIn } from "../stores";

    let isOpen = false;

    function close() {
        isOpen = false;
    }

    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }

    function autoClose(node) {
        function findClosest(tagName, el) {
            while (el && el.tagName !== tagName) {
                el = el.parentNode;
            }

            return el;
        }

        function onClick(event) {
            const anchor = findClosest("A", event.target);

            if (anchor) {
                close();
            }
        }

        node.addEventListener("click", onClick);

        return {
            destroy() {
                node.removeEventListener("click", onClick);
            }
        };
    }
</script>

<div class="mb-5" use:autoClose use:links>
    <Navbar color="primary" dark expand="md" fixed="top">
        <NavbarBrand href="/">CircleData</NavbarBrand>
        <NavbarToggler color="primary" on:click={() => isOpen = !isOpen} />
        <Collapse expand="md" {isOpen} navbar on:update={handleUpdate}>
            <Nav class="ml-auto" navbar>
                {#if $loggedIn}
                    <NavItem>
                        <NavLink on:click={api.logout}>Ausloggen</NavLink>
                    </NavItem>
                {/if}
            </Nav>
        </Collapse>
    </Navbar>
</div>
<div class="mb-1">
    .
</div>
