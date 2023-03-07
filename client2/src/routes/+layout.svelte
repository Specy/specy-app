<script lang="ts">
	import ThemeProvider from "../themes/ThemeProvider.svelte"
	import { currentTheme, themeStorage } from "../stores/themeStore"
	import Nav from "$cmp/Nav.svelte"
	import ErrorLogger from "$cmp/ErrorLogger.svelte"
	import Footer from "$cmp/Footer.svelte"
	import PageTransition from "$cmp/PageTransition.svelte"
	import Background from "$cmp/Background.svelte"
	import { page } from "$app/stores"
	import "../global.scss"
  import { onMount } from "svelte"


	onMount(() => {
		themeStorage.load()
	})
</script>

<ThemeProvider
	theme={currentTheme}
	style="color: var(--primary-text); flex: 1; background-color: var(--background);"
>
	<ErrorLogger>
		<Background>
			<Nav />
			<PageTransition refresh={$page.url.pathname}>
				<slot />
			</PageTransition>
		</Background>
		<Footer />
	</ErrorLogger>
</ThemeProvider>
