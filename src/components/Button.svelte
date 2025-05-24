<script>
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	/** @type {{disabled?: boolean, value?: string, color?: string, style?: string, bg?: string}} */
	let {
		disabled = false,
		value = '',
		color = 'white',
		style = '',
		bg = 'rgb(219, 0, 97)'
	} = $props();

</script>

<input
	type="button"
	class="btn"
	style={`background-color: ${bg}; color: ${color}; ${style}`}
	{disabled}
	{value}
    onclick={bubble('click')}
/>

<style>
    .btn {
		width: 100%;
		padding: 0.5rem;
		margin-top: 0.5rem;
		border-radius: 0.5rem;
		color: white;
		text-align: center;
		font-weight: bold;
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