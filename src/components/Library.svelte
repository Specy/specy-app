<script lang="ts">
    import type { LibraryData, LibraryLanguage } from '$lib/Projects';
    import type { Component } from 'svelte';
    import type { SvelteHTMLElements } from 'svelte/elements';
    import MdOpenInNew from '~icons/mdi/open-in-new';
    import MdTypescript from '~icons/mdi/language-typescript';
    import MdRust from '~icons/mdi/language-rust';
    import MdJava from '~icons/mdi/language-java';
    import MdC from '~icons/mdi/language-c';
    import FaGithub from '~icons/fa-brands/github';
    import FaNpm from '~icons/fa-brands/npm';
    import FaCube from '~icons/fa-solid/cube';

    interface Props {
        data: LibraryData;
    }

    let { data }: Props = $props();

    const languageIcons: Record<
        LibraryLanguage,
        Component<SvelteHTMLElements['svg']>
    > = {
        TypeScript: MdTypescript,
        Rust: MdRust,
        Java: MdJava,
        C: MdC,
    };
</script>

<div class="library">
    <div class="row">
        <div class="library-title">
            {data.title}
        </div>
        <div class="languages">
            {#each data.languages as language (language)}
                {@const LanguageIcon = languageIcons[language]}
                <div
                    class="language-tag"
                    title={language}
                    aria-label={language}
                >
                    <LanguageIcon />
                </div>
            {/each}
        </div>
    </div>
    <div class="description">
        {data.description}
    </div>
    <div class="actions">
        {#if data.github}
            <a
                href={data.github}
                target="_blank"
                rel="noreferrer"
                class="github-btn"
                title="{data.title} repository"
                aria-label="{data.title} repository"
            >
                <div class="github-icon">
                    <FaGithub />
                </div>
            </a>
        {/if}
        <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            class="open-btn"
            style="background-color: {data.color}"
        >
            <div class="registry-icon">
                {#if data.registry === 'npm'}
                    <FaNpm />
                {:else}
                    <FaCube />
                {/if}
            </div>
            <div class="registry-tag">
                {data.registry}
                <div class="icon">
                    <MdOpenInNew />
                </div>
            </div>
        </a>
    </div>
</div>

<style lang="scss">
    .library {
        background-color: rgb(31 36 43 / 50%);
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.8rem;
        border-radius: 0.8rem;
        min-width: 17rem;
        flex: 1;
    }
    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
    }
    .library-title {
        font-size: 1rem;
        font-weight: bold;
        word-break: break-word;
    }
    .languages {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        gap: 0.4rem;
        color: #dbdbdb;
    }
    .language-tag {
        display: flex;
        align-items: center;
        width: 1.1rem;
    }
    .description {
        margin-top: 0.4rem;
        flex: 1;
        color: #dbdbdb;
        font-size: 0.9rem;
    }
    .actions {
        display: flex;
        align-items: stretch;
        gap: 0.5rem;
        margin-top: 0.8rem;
    }
    .github-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.4rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        color: #dbdbdb;
        background-color: rgb(255 255 255 / 8%);
        transition: all 0.2s;
    }
    .github-btn:hover {
        background-color: rgb(255 255 255 / 16%);
        color: white;
    }
    .github-icon {
        display: flex;
        align-items: center;
        width: 1.1rem;
    }
    .open-btn {
        position: relative;
        flex: 1;
        padding: 0.5rem;
        border-radius: 0.5rem;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }
    .open-btn:hover {
        filter: brightness(1.1);
    }
    .registry-icon {
        position: absolute;
        left: 0.6rem;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        width: 1.1rem;
    }
    .registry-tag {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.9rem;
    }
    .icon {
        width: 0.9rem;
        margin-top: 0.1rem;
    }
</style>
