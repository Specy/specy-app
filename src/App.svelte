
<script lang="ts">
	import Footer from './Footer.svelte'
	import NavBar from './NavBar.svelte'
	import Main from './Main.svelte'
	import Support from './Support.svelte'
	import Contact from './Contact.svelte'
</script>


<NavBar />
<Main />
<Support />
<Contact />
<Footer />
<div class="background"></div>
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
		font-family: Orienta;
	}
	:global(.row){
		display: flex;
		flex-direction: row;
	}
	:global(.column){
		display: flex;
		flex-direction: column;
	}
	.background{
		background-image: url("/images/circle-scatter-haikei.svg");
		position: absolute;
		background-size: 100%;
		background-repeat: no-repeat;
		z-index: -1;
		width: 100%;
		height: 110%;
		top: 0;
    	left: 0;
	}
	@media screen and (orientation:portrait){
		:global(body) {
			padding:1rem
		}
		.background{
			background-image: url("/images/circle-scatter-haikei2.svg");
		}
	}
</style>
