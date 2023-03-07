<script>
	export let title = ''
</script>

<div class="center-wrapper" >
	{#if title}
		<div class="big-title" style="margin:  2.6rem 0 1.4rem;">{title}</div>
	{/if}
	<div class="floating-middle">
		<slot />
	</div>
</div>

<style>
	.floating-middle {
		display: flex;
		flex-direction: column;
		width: 30rem;
		background-color: rgba(var(--RGB-secondary), 0.8);
		backdrop-filter: blur(4px);
		box-shadow: 1px 1px 5px rgba(var(--RGB-shadow-color), 0.25);
		padding: 1rem;
		border-radius: 0.5rem;
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
