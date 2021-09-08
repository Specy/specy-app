
<script lang="ts">
	import Footer from './Footer.svelte'
	import NavBar from './NavBar.svelte'
	import Main from './Main.svelte'
	import Support from './Support.svelte'
</script>


<NavBar />
<Main />
<Support />
<Footer />

<style lang="scss">
	@import 'variables.scss';
	:global(body) {

		min-height: 100%;
		margin: 0;
		display: flex;
		flex-direction: column;
		padding: 0;
	}
	:global(*){
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: Arial;
	}
	:global(.row){
		display: flex;
		flex-direction: row;
	}
	:global(.column){
		display: flex;
		flex-direction: column;
	}
</style>
