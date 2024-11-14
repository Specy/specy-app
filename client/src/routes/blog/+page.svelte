<script lang="ts">

    let {
        data
    } = $props<{
        data: import('./$types').PageData
    }>()
</script>

<svelte:head>
    <title>Specy's Blog</title>
    <meta name="description" content="Specy's Blog" />
    <meta property="og:title" content="Specy's Blog" />
    <meta property="og:description" content="Specy's Blog" />
</svelte:head>

<div class="content-wrapper">
    <div class="content">
        <h1 class="main-title">
            Specy's Blog
        </h1>
        <div style="display: flex; flex-direction: column; gap: 1rem">

            {#each data.posts as post}
                <a class="blog-post" href={post.url}>
                    <h1 class="blog-post-title">
                        {post.title}
                    </h1>
                    <p class="blog-description">
                        {post.description}
                    </p>
                    <div class="badge-wrapper">
                        {#each post.tags as tag, i}
                <span
                        class="badge"
                        style={`--index: ${i}`}

                >{tag}</span>
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
        max-width: 80ch;
    }

    .blog-post {
        background-color: rgba(31, 36, 43, 0.5);
        box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        padding: 1rem 1.2rem;
        transition: all 0.2s;
        border-radius: 0.8rem;
    }
    .blog-post:hover{
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
        border-radius: 1rem;
        color: white;
        background-color: hsl(calc(var(--index) * 26 + -26), 40%, 50%);
    }


    .blog-description {
        font-size: 1.1rem;
        padding: 1rem;
    }
</style>