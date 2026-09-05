<script>
    import Seo from '$cmp/Seo.svelte';
    import { blogPostingLd } from '$lib/jsonld';

    /** @type {{data: import('./$types').PageData}} */
    let { data } = $props();

    const metadata = $derived(data.props.metadata);
    const SvelteComponent = $derived(data.page);
</script>

<Seo
    title={metadata.title}
    description={metadata.description}
    image={metadata.image}
    type="article"
    jsonLd={blogPostingLd(metadata)}
>
    <meta property="article:published_time" content={metadata.datePublished} />
    <meta property="article:author" content="Specy" />
    <meta property="article:section" content="Technology" />
    <meta property="article:tag" content={metadata.tags.join(',')} />
</Seo>

<SvelteComponent />
