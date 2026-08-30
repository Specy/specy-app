<script>
    /** @type {{size?: number, style?: string, hoverable?: boolean, label?: string, onclick?: (event: MouseEvent) => void, children?: import('svelte').Snippet}} */
    let {
        size = 1.2,
        style = '',
        hoverable = false,
        label,
        onclick,
        children,
    } = $props();
</script>

<button
    type="button"
    class="icon"
    aria-label={label}
    style={`width:${size}rem; min-width: ${size}; height:${size}rem; ${style};`}
    {onclick}
>
    {@render children?.()}
</button>

<style>
    .icon {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        padding: 0;
        border: none;
        background: none;
        color: inherit;
        font: inherit;
    }
</style>
