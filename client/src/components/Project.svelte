<script lang="ts">
	import type { ProjectData } from "$lib/Projects"
	import MdOpenInNew from "svelte-icons/md/MdOpenInNew.svelte"
	interface Props {
		data: ProjectData;
	}

	let { data }: Props = $props();
</script>

<div class="project">
	<div class="row">
		<img src={data.image} alt={data.title} />
		<div class="app-title">
			{data.title}
		</div>
	</div>
	<div class="description">
		{data.description}
	</div>
	<a
		href={data.url}
		target="_blank"
		class="open-btn"
		style="background-color: {data.color}"
		rel="canonical"
	>
		<div>Open</div>
		<div class="icon">
			<MdOpenInNew />
		</div>
	</a>
</div>

<style lang="scss">
	.project {
		background-color: rgb(31 36 43 / 50%);
		box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0.8rem;
		border-radius: 0.8rem;
		min-width: 16rem;
		flex: 1;
	}
	.row {
		display: flex;
		align-items: center;
		> img {
			width: 3rem;
			height: 3rem;
			margin-right: 1rem;
		}
		> .app-title {
			font-size: 1rem;
			font-weight: bold;
		}
	}
	.open-btn {
		width: 100%;
		padding: 0.5rem;
		margin-top: 0.5rem;
		border-radius: 0.5rem;
		color: white;
		text-align: center;
		display: flex;
		transition: all 0.2s;
		padding-left: 0.8rem;
		justify-content: center;
		> .icon {
			width: 0.9rem;
			margin-left: 0.2rem;
			margin-top: 0.1rem;
		}
	}
	.open-btn:hover {
		filter: brightness(1.1);
	}
	.description {
		margin-top: 0.5rem;
		flex: 1;
		width: 100%;
		overflow-y: auto;
		padding: 0.5rem;
		color: #dbdbdb;
		border-radius: 0.5rem;
	}
	::-webkit-scrollbar {
		width: 3px;
		border-radius: 2px;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: transparent;
	}

	.description:hover::-webkit-scrollbar-thumb {
		background: #555;
	}
</style>
