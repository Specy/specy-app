<script>
    import Seo from '$cmp/Seo.svelte';

    /** @type {{data: import('./$types').PageData}} */
    let { data } = $props();

    const { page, props: _props } = data;
    const { datePublished, title, description, tags, image } = _props.metadata;

    const SvelteComponent = $derived(page);
</script>

<Seo {title} {description} {image} type="article">
    <meta property="article:published_time" content={datePublished} />
    <meta property="article:author" content="Specy" />
    <meta property="article:section" content="Technology" />
    <meta property="article:tag" content={tags.join(',')} />
</Seo>

<SvelteComponent />
