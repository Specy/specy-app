<script lang="ts">
	import Project from "./Project.svelte"
	import type { ProjectData } from "./Types.js"
	import { data } from "./Projects.js"
	const projects: ProjectData[] = data
</script>

<div class="main">
	<div class="main-title">
		<div>SPECY DEV</div>
		<div>The hub of all apps</div>
	</div>
	<div class="apps">
		<div class="title project-title">Apps</div>
		<div class="projects-wrapper">
			{#each projects as project (project.title)}
				<Project data={project} />
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	@import "variables.scss";
	.main {
		padding: 1rem;
		display: flex;
		flex-direction: column;
        align-items: center;

	}
	.main-title {
		margin-top: 4rem;
		font-weight: bold;
		display: flex;
        flex-direction: column;
        align-items: center;
		justify-content: center;
		> :nth-child(1) {
            font-size: 5rem;
		}
		> :nth-child(2) {
            color: $accent;
		}
	}
    .apps{
        width: 60%;
        margin-top: 4rem;
    }
	.title {
		font-size: 1.6rem;
		font-weight: bold;
	}
	.project-title {
		margin: 5rem 0 0 0;
	}
	.projects-wrapper {
		display: grid;
        margin-top: 1rem;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap: 2rem;
	}
</style>
