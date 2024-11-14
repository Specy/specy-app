<script lang="ts">
	import Support from '$cmp/Support.svelte'
</script>

<svelte:head>
	<title>Donate</title>
	<meta name="description" content="Help the funding of the development of my apps" />
</svelte:head>

<div class="center">
	<div class="support-wrapper">
		<Support />
	</div>
</div>

<style lang="scss">
	.support-wrapper {
		background-color: rgba(31, 36, 43, 0.5);
		color: var(--secondary-text);
		box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.2);
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
