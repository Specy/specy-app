<script lang="ts" module>
	import { onMount } from "svelte"
	import mermaid from "mermaid"

	let amount = $state(0)
	let initialized = $state(false)
</script>

<script>
	import { fade } from "svelte/transition"

	let { height = "400px", width = "100%", source = "" } = $props()

	const id = Math.random().toString(36).substring(2, 15)

	onMount(() => {
		if (!initialized) {
			mermaid.initialize({
				theme: "dark",
				startOnLoad: false,
			})
			initialized = true
		}
		amount += 1
		setTimeout(
			async () => {
				await mermaid.run({
					querySelector: `#id_${id}`,
				})
			},
			100 + amount * 100
		)

		return () => {
			amount = Math.max(0, amount - 1)
		}
	})
</script>

<div class="container" style:height>
	<pre
		in:fade={{ delay: 1000, duration: 300 }}
		class="mm"
		style:height
		id={`id_${id}`}
		style:width>{source}</pre>
</div>

<style lang="scss">
	.mm {
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
