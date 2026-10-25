<script lang="ts">
    import ThemeProvider from '../themes/ThemeProvider.svelte';
    import { currentTheme, themeStorage } from '../stores/themeStore';
    import Nav from '$cmp/Nav.svelte';
    import ErrorLogger from '$cmp/ErrorLogger.svelte';
    import Footer from '$cmp/Footer.svelte';
    import PageTransition from '$cmp/PageTransition.svelte';
    import Background from '$cmp/Background.svelte';
    import { page } from '$app/state';
    import '../global.scss';
    import { onMount } from 'svelte';
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();

    // An app page wears its app's color across the whole site, not only in its own
    // content: the theme (background, nav, footer, accents) and the animated
    // background are recolored while it is open. In the layout because those live here.
    let appAccent = $derived<string | undefined>(
        page.route.id === '/apps/[id]'
            ? page.data.project?.details?.accent
            : undefined,
    );

    onMount(() => {
        themeStorage.load();
    });
</script>

<svelte:head>
    <link
        rel="alternate"
        type="application/rss+xml"
        title="RSS Feed"
        href="/feed.xml"
    />
</svelte:head>

<ThemeProvider
    theme={currentTheme}
    accent={appAccent}
    style="color: var(--primary-text); flex: 1; background-color: var(--background);"
>
    <ErrorLogger>
        <Background color={appAccent}>
            <Nav />
            <PageTransition refresh={page.url.pathname}>
                {@render children?.()}
            </PageTransition>
        </Background>
        <Footer />
    </ErrorLogger>
</ThemeProvider>
