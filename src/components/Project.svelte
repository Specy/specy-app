<script lang="ts">
    import type { ProjectData } from '$lib/Projects';
    import MdOpenInNew from '~icons/mdi/open-in-new';
    import MdBookOpenVariant from '~icons/mdi/book-open-variant';
    interface Props {
        data: ProjectData;
    }

    let { data }: Props = $props();
</script>

<div class="project">
    <div class="row">
        <img
            style="width: 3rem; height: 3rem"
            src={data.image}
            alt={data.title}
        />
        <h3 class="app-title">
            {data.title}
        </h3>
    </div>
    <div class="description">
        {data.description}
    </div>
    <!-- Siblings rather than a link wrapping the card, so neither link ends up
         nested inside the other -->
    <div class="actions">
        {#if data.details}
            <a href="/apps/{data.id}" class="info-btn">
                <span class="info-icon"><MdBookOpenVariant /></span>
                Info <span class="sr-only">about {data.title}</span>
            </a>
        {/if}
        <a
            href={data.url}
            target="_blank"
            class="open-btn"
            style="background-color: {data.color}"
        >
            <div>
                Open <span class="sr-only">{data.title}</span>
            </div>
            <div class="icon">
                <MdOpenInNew />
            </div>
        </a>
    </div>
</div>

<style lang="scss">
    .project {
        background-color: rgb(31 36 43 / 50%);
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        border: solid 1px color-mix(in srgb, var(--accent) 12%, transparent);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.8rem;
        border-radius: var(--radius-2xl);
        min-width: 17rem;
        flex: 1;
    }
    .row {
        display: flex;
        align-items: center;
        gap: 1rem;
        > img {
            border-radius: var(--radius-icon);
        }
        > .app-title {
            font-size: 1rem;
            font-weight: bold;
            margin: 0;
            line-height: inherit;
        }
    }
    .actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }
    .info-btn {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        flex-shrink: 0;
        padding: 0.5rem 0.9rem 0.5rem 0.7rem;
        border-radius: var(--radius-lg);
        color: #dbdbdb;
        background-color: rgb(255 255 255 / 8%);
        transition: all 0.2s;
    }
    .info-icon {
        display: flex;
        width: 1.1rem;
    }
    .info-btn:hover,
    .info-btn:focus-visible {
        background-color: rgb(255 255 255 / 16%);
        color: white;
    }
    .info-btn:focus-visible,
    .open-btn:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }
    .open-btn {
        flex: 1;
        padding: 0.5rem;
        border-radius: var(--radius-lg);
        color: #dbdbdb;
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
    /* Visually hidden, but still part of the link text for crawlers and screen readers */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    .info-btn,
    .open-btn {
        position: relative;
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
        border-radius: var(--radius-lg);
    }
    ::-webkit-scrollbar {
        width: 3px;
        border-radius: var(--radius-xs);
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: transparent;
    }

    .description:hover::-webkit-scrollbar-thumb {
        background: #555;
    }
</style>
