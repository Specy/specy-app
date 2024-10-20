<script>
	import { createEventDispatcher } from 'svelte'
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
	const dispatch = createEventDispatcher()
	function submit(e) {
		e.preventDefault()
		dispatch('submit', e)
	}
</script>

<form onsubmit={submit} >
    {@render children?.()}
</form>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		flex: 1;
	}
</style>
