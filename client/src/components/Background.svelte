<script>
	import { onDestroy, onMount } from 'svelte'
	let zoom = 1

	function handleZoom() {
		let currentPosition = window.scrollY
		let value = currentPosition / 600 + 1
		if (value < 2) zoom = value
	}
	let interval
	onMount(() => {
		interval = setInterval(handleZoom, 30)
	})
	onDestroy(() => {
		clearInterval(interval)
	})
</script>

<div class="background">
	<div class="background-image" style={`transform: scale(${zoom})`} />
</div>

<style lang="scss">
	.background {
		position: absolute;
		> .background-image {
			background-image: url('/images/circle-scatter-haikei.svg');
			background-size: 100%;
			width: 100%;
			height: 100%;
			background-repeat: no-repeat;
			transition: all 0.3s;
		}
		z-index: -1;
		overflow: hidden;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
	@media (orientation: portrait) {
		.background {
			> .background-image {
				background-image: url('/images/circle-scatter-haikei2.svg');
				transition: all 0.3s;
			}
		}
	}
</style>
