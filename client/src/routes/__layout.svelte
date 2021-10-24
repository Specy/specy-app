<script lang="ts">
	import '../global.scss'
	import NavBar from '../components/Nav.svelte'
	import Footer from '../components/Footer.svelte'
	import PageTransition from '../components/PageTransition.svelte';
	import ErrorLogger from '../components/ErrorLogger.svelte';
	import Background from '../components/Background.svelte';
	import { page } from '$app/stores';
</script>


<NavBar />
<Background />
<ErrorLogger>
	<PageTransition refresh={$page.path} >
		<slot/>
	</PageTransition>
</ErrorLogger>
<Footer />
