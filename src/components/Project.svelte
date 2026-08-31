<script lang="ts">
    import type { ProjectData } from '$lib/Projects';
    import MdOpenInNew from '~icons/mdi/open-in-new';
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
        border-radius: var(--radius-2xl);
        min-width: 17rem;
        flex: 1;
    }
    .row {
        display: flex;
        align-items: center;
        > img {
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
