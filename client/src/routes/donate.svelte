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
		background-color: rgba(246, 246, 246, 0.8);
		backdrop-filter: blur(4px);
		box-shadow: 1px 1px 5px rgb(69 69 89 / 25%);
		border-radius: 0.8rem;
	}
	.center {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
	}
</style>
