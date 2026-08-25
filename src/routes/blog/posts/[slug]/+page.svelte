<script>
    import { resolveImagePreviewUrl } from '$lib/imagePreviews.js';

    /** @type {{data: import('./$types').PageData}} */
    let { data } = $props();

    const SITE_URL = 'https://specy.app';

    const { page, props: _props } = data;
    const { datePublished, title, description, tags, image } = _props.metadata;

    const preview = resolveImagePreviewUrl(image);
    const shareImage = preview
        ? preview.startsWith('http')
            ? preview
            : `${SITE_URL}${preview}`
        : `${SITE_URL}/images/og-image.png`;

    const SvelteComponent = $derived(page);
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content={datePublished} />
    <meta property="article:author" content="Specy" />
    <meta property="article:section" content="Technology" />
    <meta property="article:tag" content={tags.join(',')} />
    <meta property="og:image" content={shareImage} />
    <meta property="og:image:alt" content={title} />
    <meta
        name="twitter:card"
        content={preview ? 'summary_large_image' : 'summary'}
    />
</svelte:head>

<SvelteComponent />
