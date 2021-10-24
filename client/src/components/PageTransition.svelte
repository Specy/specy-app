<script>
  import { fly,fade } from 'svelte/transition'
  export let refresh = ''
</script>

{#key refresh}
  <div
    in:fly={{x:-50, duration: 500}}
    class="page"
    >
    <slot/>
  </div>
{/key}
