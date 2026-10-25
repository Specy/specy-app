<script lang="ts">
    import Seo from '$cmp/Seo.svelte';
    import PostCard from '$cmp/PostCard.svelte';

    let { data } = $props<{
        data: import('./$types').PageData;
    }>();
</script>

<Seo
    title="Specy's Blog"
    description="Articles by Specy on web development, TypeScript and Rust, CSS tricks, assembly and compilers, optimization modeling, AI and RAG, and photography."
/>

<div class="content-wrapper">
    <div class="content">
        <h1 class="main-title">Specy's Blog</h1>
        <div style="display: flex; flex-direction: column; gap: 1.5rem">
            {#each data.posts as post (post.slug)}
                <PostCard {post} />
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
</style>
