<script>
	import { fly } from 'svelte/transition'
	/** @type {{refresh?: string, children?: import('svelte').Snippet}} */
	let { refresh = '', children } = $props();

	let status = $state('')
	let timeout = setTimeout(() =>{}, 0)
	function handleProgress(s){
		if(s === 'started') status = 'progress-70'
		if(s === 'ended'){
			status = 'progress-finish'
			clearTimeout(timeout)
			timeout = setTimeout(() => {
				status = ''
			},200)
		}
	}
</script>

<svelte:window
    onsveltekit:navigation-start={() => handleProgress('started')}
    onsveltekit:navigation-end={() => handleProgress('ended')}
/>
{#key refresh}
	<div class={`progress ${status}`}>

	</div>
	<div in:fly|global={{ x: -50, duration: 500 }} class="page column">
		{@render children?.()}
	</div>
{/key}

<style lang="scss">
	.progress{
		height: 4px;
		width: 0%;
		background-color: var(--accent);
		position: absolute;
		z-index: 1000;
	}
	.page{
		flex: 1;
	}
	.progress-70{
		width: 70%;
		transition: all 1s;
	}
	.progress-finish{
		transition: all 0.2s;
		width: 100%;
		background-color: transparent;
	}
</style>