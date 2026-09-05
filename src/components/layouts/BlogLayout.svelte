<script lang="ts">
    import './prism-one-dark.css';
    import type { PostMetadata } from '$lib/post';
    import { desktopProjects, projects } from '$lib/Projects';
    import { resolveImagePreviewUrl } from '$lib/imagePreviews.js';
    import Project from '$cmp/Project.svelte';

    let {
        children,
        datePublished,
        title,
        description,
        tags,
        image,
        relatedProjects = [],
    } = $props<PostMetadata & { children: any }>();

    let heroImage = $derived(resolveImagePreviewUrl(image));
    let articleElement = $state<HTMLElement | null>(null);
    let postElement = $state<HTMLElement | null>(null);

    let relatedProjectsData = $derived(
        relatedProjects.map(getRelatedProject).filter(Boolean),
    );

    let formattedDate = $derived(
        new Intl.DateTimeFormat(undefined, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(new Date(datePublished)),
    );

    /** Distance between the top of the document and an element, ignoring transforms */
    function documentOffsetTop(element: HTMLElement) {
        let offset = 0;
        let current: HTMLElement | null = element;
        while (current) {
            offset += current.offsetTop;
            current = current.offsetParent as HTMLElement | null;
        }
        return offset;
    }

    // The hero spans from the very top of the page (behind the navbar) down to
    // where the post itself starts, so both edges have to be measured.
    $effect(() => {
        const article = articleElement;
        const post = postElement;
        if (!heroImage || !article || !post) return;

        function measure() {
            article!.style.setProperty(
                '--hero-top',
                `${documentOffsetTop(article!)}px`,
            );
            article!.style.setProperty(
                '--hero-height',
                `${documentOffsetTop(post!)}px`,
            );
            // Custom property rather than a class/attribute: Svelte prunes
            // selectors it cannot see being used in the markup.
            article!.style.setProperty('--hero-fade', '0.4');
        }

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(article);
        observer.observe(document.body);
        window.addEventListener('resize', measure);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', measure);
        };
    });

    function getRelatedProject(id: string) {
        return (
            projects.find((project) => project.id === id) ??
            desktopProjects.find((project) => project.id === id)
        );
    }

    function animateSidetracks(node: HTMLElement) {
        const animations = new WeakMap<HTMLDetailsElement, Animation>();
        const expandedStates = new WeakMap<HTMLDetailsElement, boolean>();

        function handleClick(event: MouseEvent) {
            if (!(event.target instanceof Element)) return;

            const summary = event.target.closest('summary.sidetrack-title');
            if (!summary) return;
            const details = summary.parentElement;
            if (!(details instanceof HTMLDetailsElement)) return;

            event.preventDefault();

            const isExpanded = expandedStates.get(details) ?? details.open;
            const shouldExpand = !isExpanded;
            const startHeight = details.getBoundingClientRect().height;

            animations.get(details)?.cancel();
            expandedStates.set(details, shouldExpand);
            details.toggleAttribute('data-closing', !shouldExpand);

            if (shouldExpand) details.open = true;

            const endHeight = shouldExpand
                ? details.scrollHeight
                : summary.getBoundingClientRect().height;
            const animation = details.animate(
                {
                    height: [`${startHeight}px`, `${endHeight}px`],
                },
                {
                    duration: 200,
                    easing: 'ease',
                    fill: 'forwards',
                },
            );

            animations.set(details, animation);
            animation.onfinish = () => {
                if (!shouldExpand) details.open = false;
                details.removeAttribute('data-closing');
                expandedStates.delete(details);
                animations.delete(details);
                animation.cancel();
            };
        }

        node.addEventListener('click', handleClick);

        return {
            destroy() {
                node.removeEventListener('click', handleClick);
            },
        };
    }
</script>

<article
    class="content-wrapper"
    class:has-hero={!!heroImage}
    bind:this={articleElement}
>
    {#if heroImage}
        <div
            class="post-hero"
            style={`--hero-image: url('${heroImage}')`}
            aria-hidden="true"
        ></div>
    {/if}
    <div class="content">
        <div class="post-introduction">
            <header
                style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem"
            >
                <h1 class="main-header">{title}</h1>
                <p class="date-published">{formattedDate}</p>
            </header>
            <section class="blog-description">
                {description}
            </section>
            <div class="badge-wrapper">
                {#each tags as tag, i}
                    <span class="badge" style={`--index: ${i}`}>{tag}</span>
                {/each}
            </div>
            {#if relatedProjectsData.length > 0}
                <h2>Related Projects</h2>
                <div class="projects-wrapper">
                    {#each relatedProjectsData as project}
                        <Project data={project} />
                    {/each}
                </div>
            {/if}
        </div>

        <section
            class="md-content"
            bind:this={postElement}
            use:animateSidetracks
        >
            {@render children?.()}
        </section>
    </div>
    <a href="/blog" class="to-posts">
        {'<'} Look at other posts
    </a>
</article>

<style lang="scss">
    .to-posts {
        font-size: 1.8rem;
        color: #6c757d;
        margin-top: 2rem;
        transition: color 0.3s;
    }

    .to-posts:hover {
        color: var(--accent);
    }

    .date-published {
        font-size: 1.5rem;
        color: #6c757d;
    }

    .post-introduction {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .content-wrapper {
        margin-bottom: 6rem;
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;

        --paragraph-font: 'Noto Serif';
        --paragraph-weight: 500;
        --heading-font: 'Rubik';
        --heading-weight: 800;
        --code-font: 'Fira Code';
    }

    /* Anchors the hero, which is pulled up to the top of the page */
    .content-wrapper.has-hero {
        position: relative;
    }

    .post-hero {
        position: absolute;
        top: calc(-1 * var(--hero-top, 0px));
        left: 0;
        right: 0;
        height: var(--hero-height, 0px);
        z-index: -1;
        pointer-events: none;
        background-image: var(--hero-image);
        background-size: cover;
        background-position: center;
        /* Only faded in once measured, so it does not pop in on hydration */
        opacity: calc(0.8 * var(--hero-fade, 0));
        transition: opacity 0.5s ease;
        -webkit-mask-image: linear-gradient(
            to bottom,
            #000 0%,
            transparent 100%
        );
        mask-image: linear-gradient(to bottom, #000 0%, transparent 100%);
    }

    .content {
        --bg: rgba(23, 26, 33, 0.67);
        display: flex;
        margin-top: 3rem;
        width: 100%;
        flex-direction: column;
        gap: 1rem;
        max-width: calc(80ch + 2rem);
    }

    .md-content {
        box-shadow: 0 0 3rem 3rem var(--bg);
        background-color: var(--bg);
        padding: 1rem;
    }

    @media (max-width: 84ch) {
        .md-content {
            --bg: rgba(23, 26, 33, 0.3);
            box-shadow: unset;
            background-color: var(--bg);
        }
    }

    .md-content > :global(:first-child) {
        margin-top: 0rem !important;
    }

    .badge-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        z-index: 2;
    }

    .badge {
        padding: 0.3rem 0.7rem;
        border-radius: var(--radius-full);
        corner-shape: var(--corner-shape-round, round);
        color: white;
        background-color: hsl(calc(var(--index) * 47 + 263), 35%, 50%);
    }

    .main-header {
        font-family: var(--heading-font), Rubik, sans-serif;
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
        :global(p:not(.mermaid *)),
        :global(li:not(.mermaid *)) {
            font-size: 1.2rem;
            letter-spacing: 0.01em;
            line-height: 1.5;
            margin: 1.3rem 0;
            color: #d4d4d4;
            font-family: var(--paragraph-font), Rubik, sans-serif;
            font-weight: var(--paragraph-weight);
        }

        :global(h1) > :global(a),
        :global(h2) > :global(a),
        :global(h3) > :global(a),
        :global(h4) > :global(a) {
            letter-spacing: 0.02em;
            color: var(--background-text);
            font-family: var(--heading-font), Rubik, sans-serif;
            font-weight: var(--heading-weight);
            text-decoration: unset;
        }

        > :global(p) > :global(img),
        > :global(a) > :global(p) > :global(img) {
            width: 100%;
            max-width: 40rem;
            display: block;
            margin: 0 auto;
            border-radius: var(--radius-lg);
        }

        :global(hr) {
            border: none;
            height: 2px;
            background-color: #212431;
            margin: 2rem 0;
        }

        :global(h2) {
            margin-top: 4rem;
            font-size: 2.2rem;
        }

        :global(h3) {
            font-size: 1.8rem;
            margin-top: 2rem;
        }

        :global(video) {
            border-radius: var(--radius-lg);
            background-color: var(--bg);
        }

        :global(a) {
            color: var(--accent);
            text-decoration: underline;
        }

        :global(ul),
        :global(ol) {
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

            border-radius: var(--radius-sm) var(--radius-2xl) var(--radius-2xl)
                var(--radius-sm);
            padding: 0.5rem;
            border-left: 0.3rem solid var(--accent);
            background: color-mix(in srgb, #52537a1a, var(--accent) 5%);
        }

        :global(details.sidetrack) {
            margin: 1.5rem 0;
            border-radius: var(--radius-2xl);
            background: #52537a0e;
            border: solid 2px color-mix(in srgb, #52537a1a, var(--accent) 5%);
            overflow: hidden;

            > :global(:not(summary)) {
                margin-right: 1rem;
                margin-left: 1rem;
            }

            > :global(:last-child) {
                margin-bottom: 1rem;
            }
        }

        :global(summary.sidetrack-title) {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            padding: 0.8rem 1rem;
            background: color-mix(
                in srgb,
                rgba(82, 83, 122, 0.1019607843),
                var(--accent) 5%
            );
            font-family: var(--heading-font), Rubik, sans-serif;
            font-weight: var(--heading-weight);
            cursor: pointer;
            user-select: none;
            list-style: none;
            transition: background 0.2s ease;

            &::-webkit-details-marker {
                display: none;
            }

            &::before {
                content: '';
                width: 0.55rem;
                height: 0.55rem;
                border-right: 0.15rem solid currentColor;
                border-bottom: 0.15rem solid currentColor;
                transform: rotate(-45deg);
                transition: transform 0.2s ease;
            }

            &:hover {
                background: rgba(var(--RGB-accent), 0.08);
            }

            &:focus-visible {
                outline: 2px solid var(--accent);
                outline-offset: -2px;
            }
        }

        :global(
            details.sidetrack[open]:not([data-closing])
                > summary.sidetrack-title::before
        ) {
            transform: rotate(45deg) translate(-0.1rem, -0.1rem);
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
            font-size: 2.3rem;
        }
        .md-content {
            :global(h1) {
                font-size: 2rem;
            }

            :global(p),
            :global(li) {
                font-size: 1.1rem;
            }
        }

        .content {
            margin-top: 0rem;
        }
    }
</style>
