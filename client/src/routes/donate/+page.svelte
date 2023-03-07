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
		backdrop-filter: blur(4px);
		box-shadow: 1px 1px 5px rgba(var(--RGB-shadow-color), 0.25);
		border-radius: 0.8rem;
	}
	.center {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
	}
</style>
