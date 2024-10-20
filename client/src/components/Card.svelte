<script>
	/** @type {{morePadding?: boolean, style?: string, children?: import('svelte').Snippet}} */
	let { morePadding = false, style = '', children } = $props();
</script>

<div 
	class="card" 
	style={`padding: ${morePadding ? '1.2rem' : '0.6rem'}; ${style}`}
>
    {@render children?.()}
</div>

<style lang="scss">
	.card {
		position: relative;
		border-radius: 0.6rem;
		transition: all 0.2s;
        background-color: #f9f9ff;
        box-shadow: 1px 1px 5px rgba(var(--RGB-shadow-color), 0.25);
	}
</style>
