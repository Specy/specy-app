<script lang="ts">
	import Support from '$cmp/Support.svelte'
</script>

<div class="center">
	<div class="support-wrapper">
		<Support />
	</div>
</div>

<style lang="scss">
	.support-wrapper {
		background-color: rgba(var(--RGB-secondary), 0.8);
		color: var(--secondary-text);
		backdrop-filter: blur(0.5rem);
		box-shadow: 1px 1px 5px rgba(var(--RGB-shadow-color), 0.25);
		border-radius: 0.8rem;
		margin-top: 3rem;
		padding: 0.5rem
	}
	.center {
		display: flex;
		padding: 1rem;
		align-items: center;
		justify-content: center;
		flex: 1;
	}
</style>
