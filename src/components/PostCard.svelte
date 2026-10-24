<script lang="ts">
    import type { PostMetadata } from '$lib/post';
    import { resolveImagePreviewUrl } from '$lib/imagePreviews.js';

    interface Props {
        post: PostMetadata;
        /** `h2` in the blog index, where posts are the page's sections; `h3` where
         *  the cards sit under a section heading of their own */
        titleLevel?: 'h2' | 'h3';
        /** Smaller title and description, for cards that share a page with other content */
        compact?: boolean;
    }

    let { post, titleLevel = 'h2', compact = false }: Props = $props();

    let preview = $derived(resolveImagePreviewUrl(post.image));
</script>

<a
    class="blog-post"
    class:compact
    href={post.url}
    style={preview ? `--post-preview: url('${preview}')` : ''}
>
    <svelte:element this={titleLevel} class="blog-post-title">
        {post.title}
    </svelte:element>
    <p class="blog-description">
        {post.description}
    </p>
    <div class="badge-wrapper">
        {#each post.tags as tag, i}
            <span class="badge" style={`--index: ${i}`}>{tag}</span>
        {/each}
    </div>
</a>

<style>
    .blog-post {
        position: relative;
        isolation: isolate;
        /* The page around can restyle the card through --card-background,
           --card-background-hover and --card-border */
        background-color: var(--card-background, rgba(31, 36, 43, 0.5));
        box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        padding: 1rem 1.2rem;
        transition: all 0.2s;
        border-radius: var(--radius-2xl);
        border: solid 1px
            var(
                --card-border,
                color-mix(in srgb, var(--accent) 12%, transparent)
            );
    }

    /* Optional post image, fading from 80% at the top to 0% at the bottom */
    .blog-post::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: inherit;
        pointer-events: none;
        background-image: var(--post-preview);
        background-size: cover;
        background-position: center;
        opacity: 0.2;
        -webkit-mask-image: linear-gradient(
            to bottom,
            #000 0%,
            transparent 100%
        );
        mask-image: linear-gradient(to bottom, #000 0%, transparent 100%);
    }

    .blog-post:hover {
        background-color: var(--card-background-hover, rgba(31, 36, 43, 0.7));
        transform: translateY(-0.1rem);
    }

    .blog-post:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }

    .blog-post-title {
        font-size: 2rem;
        font-weight: bold;
    }

    .badge-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .badge {
        padding: 0.3rem 0.7rem;
        border-radius: var(--radius-full);
        corner-shape: var(--corner-shape-round, round);
        color: white;
        background-color: hsl(calc(var(--index) * 47 + 263), 35%, 50%);
    }

    .blog-description {
        font-size: 1.1rem;
        color: #dbdbdb;
        padding: 1rem;
    }

    .compact .blog-post-title {
        font-size: 1.4rem;
        line-height: 1.3;
    }

    .compact .blog-description {
        font-size: 1rem;
        padding: 0.6rem 0 1rem 0;
    }

    .compact .badge {
        font-size: 0.85rem;
    }

    @media (max-width: 600px) {
        .blog-post-title {
            font-size: 1.8rem;
        }
        .compact .blog-post-title {
            font-size: 1.3rem;
        }
    }
</style>
