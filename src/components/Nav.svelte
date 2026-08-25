<script lang="ts">
    import MdClose from '~icons/mdi/close';
    import MdMenu from '~icons/mdi/menu';
    import Logo from './logo.svelte';
    import { page } from '$app/stores';
    import { fromStore } from 'svelte/store';

    const _page = fromStore(page);
    let path = $derived(_page.current.url.pathname);
    let menuOpen = $state(false);
</script>

<nav class="nav">
    <div class="desktop-menu">
        <Logo />
        <div class="links">
            <a href="/" style={path === '/' ? 'color: var(--accent)' : ''}
                >Home</a
            >
            <a href="/#web-apps"> Apps </a>
            <a
                href="/blog"
                style={path?.startsWith('/blog') ? 'color: var(--accent)' : ''}
            >
                Blog
            </a>

            <a
                href="/donate"
                style={path === '/donate' ? 'color: var(--accent)' : ''}
                >Donate</a
            >
        </div>
        <!--
        {#if $user}
                    <a href="/profile" class="profile">
                        <FaUser />
                    </a>
                {:else}
                    <button class="login" on:click={() => toast.error("Login is not yet available!", 5000)}>
                        Login
                    </button>
                {/if}
        -->
    </div>

    <div class="mobile-menu html2canvas-ignore" class:menuOpen>
        <div class="mobile-row">
            <Logo logoToggled={menuOpen} />
            <div class="top-mobile-menu">
                <div
                    style="font-size: 2rem"
                    onclick={() => {
                        menuOpen = !menuOpen;
                    }}
                >
                    {#if menuOpen}
                        <MdClose />
                    {:else}
                        <MdMenu />
                    {/if}
                </div>
            </div>
        </div>

        <div class="links-mobile" class:menuOpen>
            <a
                href="/"
                onclick={() => (menuOpen = false)}
                style={path === '/' ? 'color: var(--accent)' : ''}>Home</a
            >
            <a
                href="/#web-apps"
                onclick={() => (menuOpen = false)}
                style={path === '/#web-apps' ? 'color: var(--accent)' : ''}
                >Apps</a
            >
            <a
                href="/blog"
                onclick={() => (menuOpen = false)}
                style={path?.startsWith('/blog') ? 'color: var(--accent)' : ''}
                >Blog</a
            >
            <a
                href="/donate"
                onclick={() => (menuOpen = false)}
                style={path === '/donate' ? 'color: var(--accent)' : ''}
                >Donate</a
            >
            <!--

            <button
                on:click={() => toast.error("Login is not yet available!", 5000)}
                style={path === "/login" ? "color: var(--accent)" : ""}
            >Login</button>
            <button
                on:click={() => toast.error("Registration is not yet available!", 5000)}
                style={path === "/register" ? "color: var(--accent)" : ""}
            >Register</button>
            {#if $user}
                <a
                href="/profile"
                on:click={() => menuOpen = false}
                style={path === "/profile" ? "color: var(--accent)" : ""}
                >Profile</a>
            {/if}
            -->
        </div>
    </div>
</nav>

<style lang="scss">
    .login {
        background-color: transparent;
        border: solid 2px var(--accent);
        color: var(--accent);
        padding: 0.5rem 1.5rem;
        border-radius: 2rem;
        transition: all 0.2s ease-in-out;
    }

    .login:hover {
        background-color: var(--accent);
        color: var(--accent-color) !important;
    }

    .desktop-menu {
        width: 100%;
        display: flex;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mobile-row {
        display: flex;
        padding: 0.5rem;

        justify-content: space-between;
        align-items: center;
    }

    .profile {
        display: flex;
        align-items: center;
        height: 2rem;
        transition: all 0.3s;
    }

    .profile:hover {
        color: var(--accent);
    }

    .mobile-menu {
        padding-bottom: 0;
        color: var(--primary-text);
        width: 100%;
        display: none;
        flex-direction: column;
        transition: all 0.2s ease-out;
    }

    /* Backdrop only while open, so the page shows through an idle navbar */
    .mobile-menu.menuOpen {
        background: linear-gradient(
            180deg,
            rgba(var(--RGB-background), 1) 0%,
            rgba(var(--RGB-background), 0.7) 100%
        );
        box-shadow: 0 0 1rem 1.5rem rgba(var(--RGB-background), 0.7);
    }

    .top-mobile-menu {
        height: 2rem;
        width: 2rem;
        display: flex;
        align-items: center;
    }

    .links {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 3rem;

        > a,
        button {
            margin-left: 1.5rem;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            text-decoration: none;
        }

        > button {
            background-color: transparent;
            border: none;
            text-align: start;
            font-size: 1rem;
        }
    }

    .links-mobile {
        width: 100%;
        flex-direction: column;
        position: absolute;
        top: 4.5rem;
        left: 0;
        overflow: hidden;
        height: 0;
        display: flex;
        padding: 0;
        transition: all 0.3s ease-out;
        backdrop-filter: blur(6px);
        justify-content: space-around;
        background-color: rgba(var(--RGB-background), 0.8);

        > a,
        button {
            padding: 0.2rem;
            margin-left: 2rem;
        }

        > button {
            background-color: transparent;
            border: none;
            color: var(--primary-text);
            text-align: start;
            font-size: 1rem;
        }
    }

    .links-mobile.menuOpen {
        opacity: 1;
        border-bottom: solid 2px var(--accent);
        height: 10rem;
    }

    .links a:hover {
        color: var(--accent);
    }

    .nav {
        padding: 0.2rem;
        margin: 3rem;
        margin-top: 2rem;
        margin-bottom: 0;
        display: flex;
        /* Needed for the z-index below to apply, so the nav stays above the
           post hero image and the positioned post content */
        position: relative;
        z-index: 10;
        justify-content: space-between;
        align-items: center;
    }

    @media (max-width: 650px) {
        .mobile-menu {
            display: flex;
        }
        .desktop-menu {
            display: none;
        }
        .profile {
            margin-right: 1rem;
            padding: 0.3rem;
        }
        .nav {
            width: 100%;
            margin: 0rem;
            margin-bottom: 2rem;
            padding: 1rem;
        }
        .links {
            display: none;
            flex-direction: column;
        }
    }
</style>
