<script lang="ts">
	import '../global.scss'
	import NavBar from '$cmp/Nav.svelte'
	import Footer from '$cmp/Footer.svelte'
	import PageTransition from '$cmp/PageTransition.svelte'
	import ErrorLogger from '$cmp/ErrorLogger.svelte'
	import Background from '$cmp/Background.svelte'
	import GlobalStyle from '$cmp/GlobalStyle.svelte'
	import { page } from '$app/stores'
</script>

<NavBar />
<Background />
<ErrorLogger>
	<PageTransition refresh={$page.path}>
		<slot />
	</PageTransition>
</ErrorLogger>
<Footer />
<GlobalStyle />
