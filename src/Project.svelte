<script lang="ts">
	import type { ProjectData } from "./Types.js"
	import MdOpenInNew from "svelte-icons/md/MdOpenInNew.svelte"
	export let data: ProjectData
</script>

<div class="project  box-shadow">
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
	>
		<div>Open</div>
        <div class="icon">
            <MdOpenInNew />
        </div>
	</a>
</div>

<style lang="scss">
	@import "variables.scss";
	.project {
		background-color: #fafafa;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0.8rem;
		border-radius: 1rem;
	}
	.row {
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
		font-weight: bold;
        display: flex;
        padding-left: 0.8rem;
        justify-content: center;
        >.icon{
            width: 0.9rem;
            margin-left: 0.2rem;
            margin-top: 0.1rem;
        }
	}
	.description {
		margin-top: 1rem;
		flex: 1;
		;
		width: 100%;
		overflow-y: scroll;
		padding: 0.5rem;
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
