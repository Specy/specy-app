<script>
	export let title = ''
	import { theme } from "$lib/theme";
</script>

<div class="center-wrapper" >
	{#if title}
		<div class="big-title" style="margin:  2.6rem 0 1.4rem;">{title}</div>
	{/if}
	<div class="floating-middle" class:dark={$theme === 'dark'}>
		<slot />
	</div>
</div>

<style>
	.floating-middle {
		display: flex;
		flex-direction: column;
		width: 30rem;
		background-color: rgba(246, 246, 246, 0.8);
		backdrop-filter: blur(4px);
		box-shadow: 1px 1px 5px rgba(69, 69, 89, 0.25);
		padding: 1rem;
		border-radius: 0.5rem;
	}
	.dark{
		background-color: rgba(29, 32, 33, 0.9);
		color: #bfbfbf;
	}
	.center-wrapper {
		display: flex;
		align-items: center;
		flex-direction: column;
		flex: 1;
	}
	.big-title {
		font-size: 2.5rem;
	}
	@media (max-width: 480px) {
		.floating-middle {
			width: 95vw;
		}
	}
</style>
