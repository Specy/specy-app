<script lang="ts">
    import {currentTheme} from "$stores/themeStore"
    import {page} from "$app/stores"
    import {fromStore} from "svelte/store";

    interface Props {
        children?: import('svelte').Snippet;
    }

    const hasFilter = (typeof window !== "undefined" ? 'filter' in CanvasRenderingContext2D.prototype : true)

    const blur = 8
    const multiplier = hasFilter ? 5 : 2
    let {children}: Props = $props();
    let canvas: HTMLCanvasElement | null = $state(null)
    let ctx: CanvasRenderingContext2D | null = $derived(canvas?.getContext("2d"))
    const offCanvas = typeof window !== "undefined" ? document.createElement("canvas") : null
    const offCtx = offCanvas?.getContext("2d")
    const defSize = 40
    let {width, height} = calculateSizes()

    function calculateSizes() {
        let aspectRatio = typeof window !== "undefined" ? window.innerWidth / document.body.scrollHeight : 1
        let screenAspectRatio = typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1
        let height = clampMultipleOf(defSize / aspectRatio, 4)
        let width = defSize
        if (screenAspectRatio < 1) {
            height = clampMultipleOf(defSize / aspectRatio / 2, 4)
            width = defSize / 2
        }
        return {width, height}
    }


    let color = currentTheme.getColor("accent")

    function clampMultipleOf(n: number, m: number) {
        return Math.ceil(n / m) * m
    }

    function createMatrix() {
        //function that creates a matrix, in which there will be stored the alive/dead cells
        let matrix = []
        for (let i = 0; i < height; i++) {
            let row = new Uint8Array(width)
            matrix.push(row)
        }
        return matrix
    }

    function generateRandomMatrix(bias: number) {
        //function that generates random cells in the matrix, the bias increases/decreases the amounts of cells created
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (!matrix[i][j]) {
                    matrix[i][j] = Math.round(Math.random() - bias)
                }
            }
        }
        return matrix
    }

    function hexToRgb(hex: string) {
        //converts the hex color to RGB, this is then used in the drawing of the canvas
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
    }

    //buffer element that stores the second canvas colors, initiates to being fully black
    let secondCanvasData = new Uint8ClampedArray(width * height * 4).fill(0)

    let matrix = createMatrix()

    function drawCanvas(
        toDraw: Uint8Array[],
        context: CanvasRenderingContext2D,
        color: string,
        erase: boolean
    ) {
        let drawHeight = toDraw.length
        let drawWidth = toDraw[0].length
        let rgbObj = hexToRgb(color)
        let data = erase
            ? new Uint8ClampedArray(width * height * 4).fill(0)
            : secondCanvasData
        //the counter is the individual pixel position in the image, divided in 4, r g b a,
        let counter = 0
        for (let i = 0; i < drawHeight; i++) {
            for (let j = 0; j < drawWidth; j++) {
                //if the current pixel has never been drawn
                if (data[counter + 3]) {
                    //if it has, ignore it and continue
                    counter += 4
                } else {
                    //if it's not, add each subpixel data
                    if (toDraw[i][j]) {
                        //if the cell is alive add the selected color to the data
                        data[counter++] = rgbObj.r
                        data[counter++] = rgbObj.g
                        data[counter++] = rgbObj.b
                        data[counter++] = 255
                    } else {
                        //if the cell is dead, turn the pixel black
                        counter += 3
                        data[counter++] = 0
                    }
                }
            }
        }
        if (!erase) secondCanvasData = data
        // Actually draw the image generated above
        const img = new ImageData(data, width, height);
        offCtx!.putImageData(img, 0, 0);
        context.clearRect(0, 0, width * multiplier, height * multiplier);

        // Draw over the whole canvas
        context.drawImage(
            offCanvas!,
            0, 0, width, height,
            0, 0, width * multiplier, height * multiplier
        );

        // Create a gradient for the mask
        const gradient = context.createLinearGradient(0, 0, 0, height * multiplier);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)'); // Start with 70% opacity
        gradient.addColorStop(Math.min(mainScreenPercentage / 100, 0.7), 'rgba(0, 0, 0, 0.5)'); // Midpoint with 50% opacity
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)'); // End with 30% opacity

// Set the gradient as a mask
        context.globalCompositeOperation = 'destination-in'; // Keep the intersection
        context.fillStyle = gradient;
        context.fillRect(0, 0, width * multiplier, height * multiplier);

// Reset globalCompositeOperation to default
        context.globalCompositeOperation = 'source-over';
    }


    function calculateGeneration(matrix: Uint8Array[]) {
        //function that calculates the next generation for Conway's game of life
        let nextGen = createMatrix()
        let width = nextGen[0].length - 1
        let height = nextGen.length - 1
        for (let i = 1; i < height; i++) {
            for (let j = 1; j < width; j++) {
                //checks for every neighbour, 1 is alive, 0 is dead
                let neighbours =
                    matrix[i - 1][j - 1] +
                    matrix[i - 1][j] +
                    matrix[i - 1][j + 1] +
                    matrix[i][j - 1] +
                    matrix[i][j + 1] +
                    matrix[i + 1][j - 1] +
                    matrix[i + 1][j] +
                    matrix[i + 1][j + 1]
                if (!matrix[i][j]) {
                    //If cell is dead
                    if (neighbours == 3) {
                        nextGen[i][j] = 1
                    }
                } else {
                    //If cell is alive
                    if (neighbours < 2 || neighbours > 3) {
                        nextGen[i][j] = 0
                    } else {
                        nextGen[i][j] = 1
                    }
                }
            }
        }
        return nextGen
    }

    let mainScreenPercentage = 1

    let firstTime = true

    function createCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const sizes = calculateSizes()
        width = sizes.width
        height = sizes.height
        canvas!.width = width * multiplier
        canvas!.height = height * multiplier
        matrix = createMatrix()
        matrix = generateRandomMatrix(0.25)
        offCanvas!.width = width * multiplier
        offCanvas!.height = height * multiplier
        ctx!.filter = `blur(${blur}px)`
        mainScreenPercentage = (window.innerHeight * 1.1) / document.body.scrollHeight * 100
        for (let i = 0; i < 20; i++) {
            matrix = calculateGeneration(matrix)
        }
        drawCanvas(matrix, ctx!, color?.toHex()!, true)
        canvas.animate([
            {opacity: firstTime ? 0 : hasFilter ? 0.5 : 0.2},
            {opacity: hasFilter ? 1 : 0.5}
        ], {
            duration: 1000,
            easing: 'cubic-bezier(.2,.7,.46,1.01)'
        })
        firstTime = false

    }


    const pageStore = $state(fromStore(page))
    $effect(() => {
        if (!canvas || !ctx) return
        createCanvas(canvas, ctx)
    })
</script>

<div class="column"
     style={`flex: 1; position: relative;`}>
    <div class="background">
        {#key pageStore.current.url}
            <canvas
                    class:noFilter={!hasFilter}
                    bind:this={canvas} class="background-image"></canvas>
        {/key}
    </div>
    <div class="column" style="flex: 1; z-index: 2">
        {@render children?.()}
    </div>
</div>
<style lang="scss">

  .background {
    position: absolute;

    > .background-image {
      width: 100%;
      height: 100%;

    }

    overflow: hidden;
    width: 100%;
    height: calc(100%);
    top: 0;
    opacity: 0.5;
    left: 0;
  }

  .noFilter {
    filter: blur(20px);
    opacity: 0.5;
  }

</style>
