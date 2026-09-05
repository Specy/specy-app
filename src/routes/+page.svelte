<script lang="ts">
    import Main from '$cmp/MainContent.svelte';
    import Support from '$cmp/Support.svelte';
    import Contact from '$cmp/Contact.svelte';
    import Seo from '$cmp/Seo.svelte';
    import TeaCupHeart from '$cmp/TeaCupHeart.svelte';
    import { homePageLd } from '$lib/jsonld';
</script>

<Seo
    title="Specy Hub"
    description="Specy.app, the hub of all apps developed by specy"
    jsonLd={homePageLd()}
/>

<Main />
<Support style="margin-top:6rem;" />
<Contact />
<TeaCupHeart />
