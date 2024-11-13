<script lang="ts">
    import {run} from 'svelte/legacy';

    import {createDebouncer} from "$lib/utils"
    import {currentTheme} from "$stores/themeStore"
    import {onMount} from "svelte"

    interface Props {
        children?: import('svelte').Snippet;
    }

    let {children}: Props = $props();
    let canvas: HTMLCanvasElement | null = $state(null)
    let ctx: CanvasRenderingContext2D | null = $derived(canvas?.getContext("2d"))
    let width = 80
    let height = 80
    let color = currentTheme.getColor("accent")

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
        //actually draw the image generated above
        const img = new ImageData(data, width, height)
        context.putImageData(img, 0, 0)
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

    let raf = 0
    let frame = 0
    let max = 60

    function handleFrame() {
        if (frame++ > max) {
            frame = 0
            //every 100 frames, draw the canvas and calculate the next generation
            matrix = calculateGeneration(matrix)
            drawCanvas(matrix, ctx!, color?.toHex()!, true)
        }
        raf = window.requestAnimationFrame(handleFrame)
    }

    function createCanvas() {
        const ratio = window.innerHeight / window.innerWidth
        if (ratio > 1) {
            width = Math.round(width / ratio)
        } else {
            height = Math.round(width * ratio)
        }
        canvas!.width = width
        canvas!.height = height
        matrix = createMatrix()
        matrix = generateRandomMatrix(0.25)
        for (let i = 0; i < 20; i++) {
            matrix = calculateGeneration(matrix)
        }
    }

    onMount(() => {
        createCanvas()
        handleFrame()
        return () => {
            window.cancelAnimationFrame(raf)
        }
    })

    function handleScroll() {
        //speed up the animation when the user scrolls
        const top = window.scrollY
        const percent = top / window.innerHeight
        max = 60 - percent * 55
        if (percent > 0.9) {
            max = 10000
        }
    }

    const [debouncer] = createDebouncer(1000)
</script>

<svelte:window
        onscroll={handleScroll}
        onresize={() => {
		if(!"ontouchstart" in window){ //don't resize on mobile
			debouncer(createCanvas)
		}
	}}
/>
<div class="column" style="flex: 1; position: relative;">
	<div class="background">
		<canvas bind:this={canvas} class="background-image"></canvas>
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
		padding: 2rem;
		height: calc(100%);
		max-height: calc(100vh);
		top: 0;
		opacity: 0.5;
		left: 0;
	}
	canvas {
		image-rendering: -moz-crisp-edges;
		image-rendering: -webkit-crisp-edges;
		image-rendering: pixelated;
		image-rendering: crisp-edges;
        filter: blur(8px);
        mask-image: linear-gradient(155deg, rgba(0,0,0, 0.2) 0%, rgba(0,0,0, 1) 200%)
	}
	@media (orientation: portrait) {
		.background {
			padding: 1rem;
		}
	}
</style>
