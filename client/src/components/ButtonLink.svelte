<script>
	/** @type {{href?: string, target?: string, style?: string, bg?: string, color?: string, children?: import('svelte').Snippet}} */
	let {
		href = '',
		target = '',
		style = '',
		bg = 'rgb(219, 0, 97)',
		color = 'white',
		children
	} = $props();
</script>

<a {href} {target} style={`background-color:${bg}; color:${color}; ${style}`} class="btn">
    {@render children?.()}
</a>

<style>
    .btn {
		width: 100%;
		padding: 0.5rem;
		margin-top: 0.5rem;
		border-radius: 0.5rem;
		color: white;
		text-align: center;
		display: flex;
		transition: all 0.2s;
		padding-left: 0.8rem;
		font-size: 1rem;
		justify-content: center;
		border: none;
		cursor: pointer;
	}
	.btn:hover {
		filter: brightness(1.2);
	}
</style>