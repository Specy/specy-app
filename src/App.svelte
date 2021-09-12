<script lang="ts">
	import Footer from "./Footer.svelte"
	import NavBar from "./NavBar.svelte"
	import Main from "./Main.svelte"
	import Support from "./Support.svelte"
	import Contact from "./Contact.svelte"
import { onDestroy, onMount } from "svelte";
	let zoom = 1

	function handleZoom(){
		let currentPosition = window.scrollY
		let value = currentPosition / 600 + 1
		if(value < 2.5) zoom = value
	}
	let interval
	onMount(() => {
		interval = setInterval(handleZoom, 16)
	})
	onDestroy(() => {
		alert('a')
		clearInterval(interval)
	})
</script>

<NavBar />
<Main />
<Support />
<Contact />
<Footer />
<div class="background" >
	<div class="background-image" style={`transform: scale(${zoom})`}></div>
</div>
<style lang="scss">
	@import "variables.scss";
	:global(body) {
		min-height: 100%;
		margin: 0;
		display: flex;
		flex-direction: column;
		padding: 0;
	}
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: Orienta;
		-webkit-tap-highlight-color: transparent;
	}
	:global(a){
		text-decoration: none;
	}
	:global(.row) {
		display: flex;
		flex-direction: row;
	}
	:global(.column) {
		display: flex;
		flex-direction: column;
	}
	.background {
		position: absolute;
		 > .background-image{
			background-image: url("/images/circle-scatter-haikei.svg");
			background-size: 100%;
			width: 100%;
			height: 100%;
			background-repeat: no-repeat;
			transition: all 1s;
		}
		z-index: -1;
		overflow: hidden;
		width: 100%;
		height: 140%;
		top: 0;
		left: 0;

	}
	@media screen and (orientation: portrait) {
		:global(body) {
			padding: 1rem;
		}
		.background {
			> .background-image{
				background-image: url("/images/circle-scatter-haikei2.svg");
			transition: all 0.3s;
			}
		}
	}
</style>
