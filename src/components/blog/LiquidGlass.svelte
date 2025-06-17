<script lang="ts">

    import type {LiquidGlass, PaintLayerCache} from '@specy/liquid-glass'
    import {onMount, type Snippet} from 'svelte'

    let glassEffect1: LiquidGlass | null = $state(null)
    let glassEffect2: LiquidGlass | null = $state(null)
    let row: HTMLAnchorElement | null = $state(null)

    onMount(() => {
        import('@specy/liquid-glass').then(({LiquidGlass, PaintLayerCache}) => {
            // Configure the paint cache for better performance
            PaintLayerCache.useHtml2CanvasPro(false)
            
            // Create the container row
            row = document.createElement('a')
            row.href = 'https://github.com/Specy/liquid-glass'
            row.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: fixed;
                bottom: 0.5rem;
                width: fit-content;
                max-width: calc(100vw - 1rem);
                margin: 0 auto;
                left: 0.5rem;
                gap: 0.5rem;
                right: 0.5rem;
                z-index: 10;
            `

            // Left glass element (GitHub link)
            glassEffect1 = new LiquidGlass(
                document.body,
                `
                padding: 0.8rem 3rem;
                overflow: hidden;
                font-size: 1.15rem;
                color: white;
                1px 1px 2px black;
                `,
                {
                    radius: 24,
                    depth: 22,  
                }
            )

            const el = `Star it on Github!`

            const element = document.createElement('div')
            element.innerHTML = el
            glassEffect1.content.appendChild(element)

            // Right glass element (small circular one)
            glassEffect2 = new LiquidGlass(
                document.body,
                `
                width: 3rem;
                height: 3rem;
                display: flex;
                align-items: center;
                justify-content: center;
                `,
                {
                    radius: 24,
                    depth: 24,

                }
            )

            // Add icon/content to the circular glass element
            const circleContent = document.createElement('div')
            circleContent.innerHTML = '⭐'
            circleContent.style.cssText = `
                font-size: 18px;
            `
            glassEffect2.content.appendChild(circleContent)

            // Add both glass elements to the row
            row.appendChild(glassEffect1.element)
            row.appendChild(glassEffect2.element)
        })
    })

    $effect(() => {
        if (!row) return
        document.body.appendChild(row)
        return () => {
            row?.remove()
            glassEffect1?.destroy()
            glassEffect2?.destroy()
        }
    })

</script>