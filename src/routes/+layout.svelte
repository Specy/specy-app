<script lang="ts">
	import ThemeProvider from "../themes/ThemeProvider.svelte"
	import { currentTheme, themeStorage } from "../stores/themeStore"
	import Nav from "$cmp/Nav.svelte"
	import ErrorLogger from "$cmp/ErrorLogger.svelte"
	import Footer from "$cmp/Footer.svelte"
	import PageTransition from "$cmp/PageTransition.svelte"
	import Background from "$cmp/Background.svelte"
	import { page } from "$app/state"
	import "../global.scss"
  import { onMount } from "svelte"
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();


	onMount(() => {
		themeStorage.load()
	})
</script>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed.xml" />
</svelte:head>

<ThemeProvider
	theme={currentTheme}
	style="color: var(--primary-text); flex: 1; background-color: var(--background);"
>
	<ErrorLogger>
		<Background>
			<Nav />
			<PageTransition refresh={page.url.pathname}>
				{@render children?.()}
			</PageTransition>
		</Background>
		<Footer />
	</ErrorLogger>
</ThemeProvider>
