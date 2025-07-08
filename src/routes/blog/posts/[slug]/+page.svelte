<script>
	
    /** @type {{data: import('./$types').PageData}} */
    let { data } = $props();

	const { page, props: _props } = data;
    const { datePublished, title, description, tags } = _props.metadata;


    const SvelteComponent = $derived(page);
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description}/>
    <meta property="og:title" content={title}/>
    <meta property="og:description" content={description}/>
    <meta property="og:type" content="article"/>
    <meta property="article:published_time" content={datePublished}/>
    <meta property="article:author" content="Specy"/>
    <meta property="article:section" content="Technology"/>
    <meta property="article:tag" content={tags.join(",")}/>
    <meta property="og:image" content="https://specy.app/images/og-image.png"/>
</svelte:head>

<SvelteComponent />