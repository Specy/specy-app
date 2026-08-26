<script lang="ts">
    import { page } from '$app/state';
    import { resolveShareImage, toAbsoluteUrl } from '$lib/seo';

    // Every page goes through here so the document ends up with exactly one
    // og:image. Crawlers disagree on what to do with more than one: some show
    // the whole set, others keep the last one they saw, which used to be the
    // site wide default appended by app.html.
    let {
        title,
        description,
        image,
        type = 'website',
        keywords,
        children,
    } = $props<{
        title: string;
        description: string;
        /** Full resolution image of the page, resolved to its generated preview */
        image?: string | null;
        type?: string;
        keywords?: string;
        children?: any;
    }>();

    let share = $derived(resolveShareImage(image));
    let url = $derived(toAbsoluteUrl(page.url.pathname));
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    {#if keywords}
        <meta name="keywords" content={keywords} />
    {/if}
    <meta property="og:site_name" content="Specy" />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={share.url} />
    <meta property="og:image:alt" content={title} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={share.url} />
    {@render children?.()}
</svelte:head>
