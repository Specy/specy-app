<script lang="ts">

    import type {LiquidGlass} from '@specy/liquid-glass'
    import {onMount, type Snippet} from 'svelte'

    let liquidGlass: LiquidGlass | null = $state(null)

    let {
        children
    } = $props<{
        children?: Snippet
    }>()
    let ref = $state<HTMLElement | null>(null)

    onMount(() => {
        import('@specy/liquid-glass').then(({LiquidGlass}) => {
            LiquidGlass.useHtml2CanvasPro(false)
            liquidGlass = new LiquidGlass(
                document.body,
                {
                    allowTaint: true,
                    useCORS: true,
                    scale: 1, // Match device pixel ratio for better quality
                    logging: false,
                    backgroundColor: null, // Preserve original background colors
                },
                `position: fixed;
                        bottom: 0.5rem;
                        z-index: 2;
                        width: fit-content;
                        max-width: calc(100vw - 1rem);
                        left: 0;
                        right: 0;
                        margin: 0 auto;
                        padding: 1rem 2rem;
                        overflow: hidden;
                        `,
                {
                    radius: 22,
                    depth: 22,
                    segments: 32,
                    roughness: 0.2,
                }
            )
        })
    })

    $effect(() => {
        if (children && liquidGlass) {
            liquidGlass.content.innerHTML = '' // Clear previous content
            liquidGlass.content.append(...(ref?.children ?? []))
        }
    })

    $effect(() => {
        if (!liquidGlass) return
        document.body.appendChild(liquidGlass.element)
        return () => {
            liquidGlass?.element.remove()
            liquidGlass?.destroy()
        }
    })

</script>

<div bind:this={ref} style="display: none">
    {@render children?.()}
</div>
