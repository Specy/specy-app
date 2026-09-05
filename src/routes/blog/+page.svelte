<script lang="ts">
    import { resolveImagePreviewUrl } from '$lib/imagePreviews.js';
    import Seo from '$cmp/Seo.svelte';

    let { data } = $props<{
        data: import('./$types').PageData;
    }>();
</script>

<Seo title="Specy's Blog" description="Specy's Blog" />

<div class="content-wrapper">
    <div class="content">
        <h1 class="main-title">Specy's Blog</h1>
        <div style="display: flex; flex-direction: column; gap: 1.5rem">
            {#each data.posts as post}
                {@const preview = resolveImagePreviewUrl(post.image)}
                <a
                    class="blog-post"
                    href={post.url}
                    style={preview ? `--post-preview: url('${preview}')` : ''}
                >
                    <h2 class="blog-post-title">
                        {post.title}
                    </h2>
                    <p class="blog-description">
                        {post.description}
                    </p>
                    <div class="badge-wrapper">
                        {#each post.tags as tag, i}
                            <span class="badge" style={`--index: ${i}`}
                                >{tag}</span
                            >
                        {/each}
                    </div>
                </a>
            {/each}
        </div>
    </div>
</div>

<style>
    .main-title {
        font-size: 2.5rem;
        margin-bottom: 2rem;
        font-weight: bold;
    }

    .content-wrapper {
        padding: 1rem;
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content {
        display: flex;
        margin-top: 5rem;
        width: 100%;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 8rem;
        max-width: 80ch;
    }

    .blog-post {
        position: relative;
        isolation: isolate;
        background-color: rgba(31, 36, 43, 0.5);
        box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        padding: 1rem 1.2rem;
        transition: all 0.2s;
        border-radius: var(--radius-2xl);
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
        background-color: rgba(31, 36, 43, 0.7);
        transform: translateY(-0.1rem);
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

    @media (max-width: 600px) {
        .blog-post-title {
            font-size: 1.8rem;
        }
    }
</style>
