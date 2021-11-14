<script lang="ts">
	import '../global.scss'
	import NavBar from '$cmp/Nav.svelte'
	import Footer from '$cmp/Footer.svelte'
	import PageTransition from '$cmp/PageTransition.svelte'
	import ErrorLogger from '$cmp/ErrorLogger.svelte'
	import Background from '$cmp/Background.svelte'
	import GlobalStyle from '$cmp/GlobalStyle.svelte'
	import { page } from '$app/stores'
	import { browser } from '$app/env';
	import { theme } from '$lib/theme';
	theme.subscribe((value) => {
		if(!browser) return
		if(value === 'dark') return document.body.classList.add("body-dark")
		document.body.classList.remove("body-dark")	
	})
</script>

<NavBar />
<ErrorLogger>
	<PageTransition refresh={$page.path}>
		<slot />
	</PageTransition>
</ErrorLogger>
<Footer />
<Background />
<GlobalStyle />
