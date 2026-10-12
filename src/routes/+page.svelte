<script lang="ts">
    import Main from '$cmp/MainContent.svelte';
    import Support from '$cmp/Support.svelte';
    import Contact from '$cmp/Contact.svelte';
    import Seo from '$cmp/Seo.svelte';
    import TeaCupHeart from '$cmp/TeaCupHeart.svelte';
    import { homePageLd } from '$lib/jsonld';
</script>

<Seo
    title="Specy Hub: music, assembly and optimization apps by Specy"
    description="Specy.app, the hub of apps by Specy: Sky and Genshin music tools, the ASM Editor assembly IDE and emulator, the ROOC optimization language, Tokeko parser playground and learning notes."
    jsonLd={homePageLd()}
/>

<Main />
<Support style="margin-top:6rem;" />
<Contact />
<TeaCupHeart />
