<script>
	import { onMount } from "svelte"
	import mermaid from "mermaid"
	import { fade } from "svelte/transition"
	export let height = "400px"
	export let width = "100%"
	export let source = ""


	onMount(() => {
		mermaid.initialize({
			theme: "dark",
			startOnLoad: false,
		})
		setTimeout(async () => {
			await mermaid.run({
				querySelector: ".mermaid",
			})
		}, 100)
	})
</script>

<div class="container" style:height={height}>
	<pre in:fade={{ delay: 1000, duration: 300 }} class="mermaid" style:height={height} style:width={width}>{source}</pre>
</div>

<style lang="scss">
	.mermaid {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.container {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
</style>
