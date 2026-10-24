<script lang="ts">
    import type { AppPageProject } from '$lib/Projects';
    import MdArrowRight from '~icons/mdi/arrow-right';

    interface Props {
        project: AppPageProject;
        /** Position in its list, staggers the entry animation */
        index?: number;
    }

    let { project, index = 0 }: Props = $props();
</script>

<a
    class="app-link"
    href="/apps/{project.id}"
    style="--app-color: {project.color}; --index: {index}"
>
    <img
        src={project.image}
        alt=""
        class="app-link-icon"
        width="48"
        height="48"
        loading="lazy"
    />
    <div class="app-link-text">
        <h3 class="app-link-title">{project.title}</h3>
        <p class="app-link-tagline">{project.details.tagline}</p>
    </div>
    <div class="app-link-arrow" aria-hidden="true">
        <MdArrowRight />
    </div>
</a>

<style lang="scss">
    .app-link {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.8rem 1rem;
        border-radius: var(--radius-2xl);
        background-color: rgb(31 36 43 / 50%);
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        border: solid 1px transparent;
        transition: all 0.2s;
        animation: rise 0.5s backwards cubic-bezier(0.2, 0.7, 0.46, 1);
        animation-delay: calc(var(--index) * 60ms);
    }
    .app-link:hover,
    .app-link:focus-visible {
        background-color: rgb(31 36 43 / 75%);
        border-color: var(--app-color);
        transform: translateY(-0.1rem);
    }
    .app-link:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
    .app-link-icon {
        width: 3rem;
        height: 3rem;
        flex-shrink: 0;
        border-radius: var(--radius-lg);
    }
    .app-link-text {
        flex: 1;
        min-width: 0;
    }
    .app-link-title {
        font-size: 1.05rem;
        font-weight: bold;
        line-height: 1.3;
    }
    .app-link-tagline {
        margin-top: 0.2rem;
        font-size: 0.9rem;
        line-height: 1.35;
        color: #b9b9c4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .app-link-arrow {
        width: 1.3rem;
        flex-shrink: 0;
        display: flex;
        color: #dbdbdb;
        transition: transform 0.2s;
    }
    .app-link:hover .app-link-arrow,
    .app-link:focus-visible .app-link-arrow {
        transform: translateX(0.2rem);
        color: var(--accent);
    }
    @keyframes rise {
        from {
            opacity: 0;
            transform: translateY(0.6rem);
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .app-link {
            animation: none;
        }
    }
</style>
