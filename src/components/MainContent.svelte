<script lang="ts">
	import Project from '$cmp/Project.svelte'
	import type { ProjectData } from '$lib/Projects'
	import { projects, desktopProjects } from '$lib/Projects'
</script>

<main class="main">
	<div class="main-title">
		<div>SPECY DEV</div>
		<div class="hub-name">The hub of all apps</div>
	</div>
	<div class="apps" id="web-apps" style="margin-top: 4rem;">
		<div class="title project-title">Web Apps</div>
		<div class="projects-wrapper">
			{#each projects.filter(p => !p.hidden) as project (project.title)}
				<Project data={project} />
			{/each}
		</div>
	</div>
	<div class="apps" id="desktop-apps">
		<div class="title project-title">Desktop apps</div>
		<div class="projects-wrapper">
			{#each desktopProjects as project (project.title)}
				<Project data={project} />
			{/each}
		</div>
	</div>
</main>

<style lang="scss">
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
	}
	.hub-name{
		font-size: 1.2rem;
		text-shadow: 1px 1px 4px rgba(var(--RGB-shadow-color), 0.25);
	}
	.main-title {
		margin-top: 4rem;
		font-weight: bold;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		> :nth-child(1) {
			font-size: 5rem;
			font-family: Arial;
		}
		> :nth-child(2) {
			color: var(--accent);
		}
	}

	.title {
		font-size: 1.6rem;
		font-weight: bold;
	}
	.project-title {
		margin: 3rem 0 0 0;
	}
	.apps {
		max-width: 50rem;
	}
	.projects-wrapper {
		display: grid;
		margin-top: 1rem;
		margin-left: 1rem;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 1fr;
		gap: 1rem;
	}
	@media (max-width: 900px) {
		.projects-wrapper {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 600px) {
		.projects-wrapper {
			grid-template-columns: repeat(1, 1fr);
			margin-left: 0rem;
		}
		.apps {
			width: 100%;
		}
	}
</style>
