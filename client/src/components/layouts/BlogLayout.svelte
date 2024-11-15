<script lang="ts">
    import './prism-one-dark.css'
    import type {PostMetadata} from "$lib/post";
    import {desktopProjects, projects} from "$lib/Projects";
    import Project from "$cmp/Project.svelte";

    let {
        children,
        datePublished,
        title,
        description,
        tags,
        relatedProjects
    } = $props<PostMetadata & { children: any }>()

    let relatedProjectsData = $derived(relatedProjects.map(getRelatedProject).filter(Boolean))

    function getRelatedProject(id: string) {
        return projects.find(project => project.id === id) ?? desktopProjects.find(project => project.id === id)
    }
</script>

<article class="content-wrapper">
    <div class="content">
        <header style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem">
            <h1 class="main-header">{title}</h1>
            <p class="date-published">{new Date(datePublished).toLocaleDateString()}</p>

        </header>
        <section class="blog-description">
            {description}
        </section>
        <div class="badge-wrapper">
            {#each tags as tag, i}
                <span
                        class="badge"
                        style={`--index: ${i}`}

                >{tag}</span>
            {/each}
        </div>
        {#if relatedProjectsData.length > 0}
            <h1>Related Projects</h1>
            <div class="projects-wrapper">
                {#each relatedProjectsData as project}
                    <Project data={project}/>
                {/each}
            </div>
        {/if}
        <section class="md-content">
            {@render children?.()}
        </section>
    </div>
</article>


<style lang="scss">


  .date-published {
    font-size: 1.5rem;
    color: #6c757d;
  }

  .content-wrapper {
    padding: 1rem;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;

    --paragraph-font: "Noto Serif";
    --paragraph-weight: 500;
    --heading-font: "Rubik";
    --heading-weight: 800;
    --code-font: "Fira Code";
  }


  .content {
    --bg: rgba(23, 26, 33, 0.67);
    display: flex;
    margin-top: 3rem;
    width: 100%;
    flex-direction: column;
    gap: 1rem;
    max-width: 80ch;

  }

  .md-content {
    box-shadow: 0 0 6rem 6rem var(--bg);
    background-color: var(--bg);
  }

  @media (max-width: 600px) {
    .md-content {
      --bg: rgba(23, 26, 33, 0.3);
      box-shadow: 0 0 6rem 6rem var(--bg);
      background-color: var(--bg);
    }
  }

  .md-content > :global(:first-child) {
    margin-top: 1rem !important;
  }

  .badge-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    z-index: 2;
  }

  .badge {
    padding: 0.3rem 0.7rem;
    border-radius: 1rem;
    color: white;
    background-color: hsl(calc(var(--index) * 26 + -26), 40%, 50%);
  }

  .main-header {
    font-size: 3.2rem;
    font-weight: bold;
  }

  .blog-description {
    font-size: 1.4rem;
    line-height: 1.5;
    font-family: var(--paragraph-font), Rubik, sans-serif;
    color: #dbdbdb;
    padding: 1rem;
    z-index: 2;
  }

  .md-content {
    margin-top: 1rem;

    :global(p) {
      font-size: 1.2rem;
      letter-spacing: 0.01em;
      line-height: 1.5;
      margin: 1.3rem 0;
      color: #dbdbdb;
      font-family: var(--paragraph-font), Rubik, sans-serif;
      font-weight: var(--paragraph-weight);
    }


    :global(h1) > :global(a),
    :global(h2) > :global(a),
    :global(h3) > :global(a),
    :global(h4) > :global(a) {
      letter-spacing: 0.02em;
      color: var(--background-text);
      font-family: var(--heading-font), Rubik, sans-serif;;
      font-weight: var(--heading-weight);
      text-decoration: unset;
    }

    :global(h1) {
      margin-top: 4rem;
      font-size: 2.2rem;
    }

    :global(a) {
      color: var(--accent);
      text-decoration: underline;
    }


    :global(ul), :global(ol) {
      padding-left: 1rem;
      font-size: 1.1rem;
      color: #dbdbdb;

      > :global(li) {
        margin: 0.5rem 0;
      }
    }

    :global(blockquote) {
      :global(:first-child) {
        margin-top: 0;
      }

      :global(:last-child) {
        margin-bottom: 0;
      }

      border-radius: 0.3rem 0.8rem 0.8rem 0.3rem;
      padding: 0.5rem;
      border-left: 0.3rem solid var(--accent);
      background: rgb(31 36 43 / 70%);
    }

  }

  .projects-wrapper {
    display: grid;
    z-index: 2;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
    gap: 1rem;
  }

  @media (max-width: 600px) {
    .projects-wrapper {
      grid-template-columns: repeat(1, 1fr);
      margin-left: 0rem;
    }
    .main-header {
      font-size: 2.5rem;
    }
    .md-content {
      :global(h1) {
        font-size: 2rem;
      }

      :global(p) {
        font-size: 1.1rem;
      }
    }
  }
</style>