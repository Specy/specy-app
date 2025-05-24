<script>
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    /** @type {{size?: number, style?: string, hoverable?: boolean, children?: import('svelte').Snippet}} */
    let {
        size = 1.2,
        style = '',
        hoverable = false,
        children
    } = $props();
</script>

<div class="icon" style={`width:${size}rem; min-width: ${size}; height:${size}rem; ${style};`} onclick={bubble('click')}>
    {@render children?.()}
</div>

<style>
    .icon{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
    }
</style>