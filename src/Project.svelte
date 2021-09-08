<script lang="ts">
	import type { ProjectData } from "./Types.js"
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
</div>

<style lang="scss">
	@import "variables.scss";
	.project {
		background-color: white;
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
	.description {
		margin-top: 1rem;
		background-color: #ededed;
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

    .description:hover::-webkit-scrollbar-thumb{
        background: #555;
    }
</style>
