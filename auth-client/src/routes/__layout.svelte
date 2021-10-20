<script lang="ts">
	import '../global.scss'
	import NavBar from '../components/Nav.svelte'
	import Footer from '../components/Footer.svelte'
	import PageTransition from '../components/PageTransition.svelte';
	import { page } from '$app/stores';
</script>


<NavBar />
<PageTransition refresh={$page.path}>
	<slot />
</PageTransition>

<Footer />

