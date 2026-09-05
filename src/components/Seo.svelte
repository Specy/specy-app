<script lang="ts">
    import { page } from '$app/state';
    import { resolveShareImage, toAbsoluteUrl } from '$lib/seo';
    import { serializeJsonLd } from '$lib/jsonld';

    // Every page goes through here so the document ends up with exactly one
    // og:image. Crawlers disagree on what to do with more than one: some show
    // the whole set, others keep the last one they saw, which used to be the
    // site wide default appended by app.html.
    let {
        title,
        description,
        image,
        type = 'website',
        jsonLd,
        children,
    } = $props<{
        title: string;
        description: string;
        /** Full resolution image of the page, resolved to its generated preview */
        image?: string | null;
        type?: string;
        /** Schema.org graph for this page, serialized into a ld+json block */
        jsonLd?: unknown;
        children?: any;
    }>();

    let share = $derived(resolveShareImage(image));
    let url = $derived(toAbsoluteUrl(page.url.pathname));
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <!-- Self referencing, so every page states which URL it wants to be ranked as.
         Without it a crawler that reaches the same content by another route (or an
         older copy of it on a different host) is free to pick that one instead. -->
    <link rel="canonical" href={url} />
    <meta property="og:site_name" content="Specy" />
    <meta property="og:type" content={type} />
    <meta property="og:url" content={url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={share.url} />
    <meta property="og:image:alt" content={title} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={share.url} />
    {#if jsonLd}
        {@html `<script type="application/ld+json">${serializeJsonLd(jsonLd)}</script>`}
    {/if}
    {@render children?.()}
</svelte:head>
