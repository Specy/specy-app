<script lang="ts">
    //Easter egg: a barely visible tea cup that morphs into a big beating heart when clicked.
    import {
        BEAT_MS,
        FLUSH_COLOR,
        HEART_COLOR,
        HEART_SEGMENTS,
        HEART_START,
        SWOLLEN_SEGMENTS,
        SWOLLEN_START,
        mix,
        swellAt,
        type Segment,
    } from '$lib/heart';

    //The cup is drawn with the same six cubic segments as the heart, walked clockwise
    //from the top center, so the two can be interpolated point by point to morph between.
    const CUP_START: [number, number] = [50, 36];
    const CUP_SEGMENTS: Segment[] = [
        [62, 36, 74, 34, 82, 32],
        [80, 46, 78, 60, 72, 70],
        [66, 76, 58, 78, 50, 78],
        [42, 78, 34, 76, 28, 70],
        [22, 60, 20, 46, 18, 32],
        [26, 34, 38, 36, 50, 36],
    ];

    const MORPH_MS = 1100;
    const BEATS = 2;
    const MORPH_END = MORPH_MS;
    const BEATS_END = MORPH_END + BEAT_MS * BEATS;
    const TOTAL_MS = BEATS_END + MORPH_MS;

    const IDLE_OPACITY = 0.15;
    const HEART_OPACITY = 0.98;

    let slot: HTMLDivElement | null = $state(null);
    let button: HTMLButtonElement | null = $state(null);
    let shape = $state(shapeAt(0));
    let cupOnlyOpacity = $state(1);
    let cupOnlyScale = $state(1);
    let animatedStyle = $state('');
    let playing = false;

    //t = 0 is the tea cup, t = 1 is the resting heart, swell expands that heart
    function shapeAt(t: number, swell = 0) {
        const at = (cup: number, relaxed: number, full: number) =>
            mix(cup, mix(relaxed, full, swell), t).toFixed(2);
        const parts = [
            `M${at(CUP_START[0], HEART_START[0], SWOLLEN_START[0])} ${at(CUP_START[1], HEART_START[1], SWOLLEN_START[1])}`,
        ];
        CUP_SEGMENTS.forEach((cup, i) => {
            const relaxed = HEART_SEGMENTS[i];
            const full = SWOLLEN_SEGMENTS[i];
            parts.push(
                `C${cup.map((v, j) => at(v, relaxed[j], full[j])).join(' ')}`,
            );
        });
        parts.push('Z');
        return parts.join(' ');
    }

    function easeInOut(t: number) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function parseRgb(color: string): [number, number, number] {
        const [r, g, b] = color.match(/\d+(\.\d+)?/g)?.map(Number) ?? [];
        return [r ?? 219, g ?? 219, b ?? 219];
    }

    //while animating the element is fixed to the viewport so it can grow past the
    //page without adding scroll, the slot keeps its place in the layout
    function render(t: number, swell: number, idle: [number, number, number]) {
        const box = slot!.getBoundingClientRect();
        const heartSize = Math.max(
            180,
            Math.min(window.innerWidth * 0.55, window.innerHeight * 0.55, 380),
        );
        const grow = 1 + (heartSize / box.width - 1) * t;
        const x = (window.innerWidth / 2 - (box.left + box.width / 2)) * t;
        const y = (window.innerHeight / 2 - (box.top + box.height / 2)) * t;
        //the heart throws itself open on the beat and wrings round its long axis with it
        const pump = 1 + 0.07 * swell;
        const twist = 2.2 * swell;
        const flush = Math.max(0, swell) * 0.5;
        const color = HEART_COLOR.map((c, i) =>
            Math.round(mix(idle[i], mix(c, FLUSH_COLOR[i], flush), t)),
        );
        shape = shapeAt(t, swell);
        cupOnlyOpacity = Math.max(0, 1 - t * 1.8);
        cupOnlyScale = 1 - 0.4 * t;
        animatedStyle = `
            position: fixed;
            left: ${box.left}px;
            top: ${box.top}px;
            right: auto;
            bottom: auto;
            width: ${box.width}px;
            height: ${box.height}px;
            z-index: 30;
            pointer-events: none;
            transition: none;
            color: rgb(${color.join(', ')});
            opacity: ${mix(IDLE_OPACITY, HEART_OPACITY, t)};
            transform: translate(${x}px, ${y}px) rotate(${45 * (1 - t) + twist}deg) scale(${grow * pump});
        `;
    }

    function reset() {
        playing = false;
        animatedStyle = '';
        shape = shapeAt(0);
        cupOnlyOpacity = 1;
        cupOnlyScale = 1;
    }

    function play() {
        if (playing || !slot || !button) return;
        playing = true;
        const idle = parseRgb(getComputedStyle(button).color);
        const start = performance.now();
        function frame(now: number) {
            const elapsed = now - start;
            let t: number;
            let swell = 0;
            if (elapsed < MORPH_END) {
                //slowly opening into the heart
                t = easeInOut(elapsed / MORPH_MS);
            } else if (elapsed < BEATS_END) {
                t = 1;
                swell = swellAt(((elapsed - MORPH_END) % BEAT_MS) / BEAT_MS);
            } else if (elapsed < TOTAL_MS) {
                //slowly folding back into the tea cup
                t = easeInOut(1 - (elapsed - BEATS_END) / MORPH_MS);
            } else {
                reset();
                return;
            }
            render(t, swell, idle);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }
</script>

<div class="cup-slot" bind:this={slot}>
    <button
        class="cup"
        style={animatedStyle}
        bind:this={button}
        onclick={play}
        title="A cup of tea"
        aria-label="A cup of tea"
    >
        <svg viewBox="0 0 100 100" aria-hidden="true">
            <g
                opacity={cupOnlyOpacity}
                transform="translate(50 50) scale({cupOnlyScale}) translate(-50 -50)"
            >
                <path class="steam" d="M41 26C36 20 46 15 41 9" />
                <path class="steam" d="M59 26C54 20 64 15 59 9" />
                <path class="handle" d="M80 42C94 41 95 58 76 61" />
                <path
                    class="saucer"
                    d="M19 81C19 78 81 78 81 81C81 88 68 91 50 91C32 91 19 88 19 81Z"
                />
            </g>
            <path class="body" d={shape} />
        </svg>
    </button>
</div>

<style lang="scss">
    .cup-slot {
        position: relative;
        flex-shrink: 0;
        width: 5.5rem;
        height: 5.5rem;
        margin: 0 auto 4rem auto;
    }
    .cup {
        position: absolute;
        inset: 0;
        display: block;
        padding: 0;
        border: none;
        overflow: visible;
        background: none;
        cursor: pointer;
        color: var(--primary-text);
        opacity: 0.12;
        transform: rotate(45deg);
        transform-origin: center;
        transition: opacity 0.4s ease;
    }
    .cup:hover,
    .cup:focus-visible {
        opacity: 0.3;
    }
    svg {
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    .body,
    .saucer {
        fill: currentColor;
    }
    .handle,
    .steam {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
    }
    .handle {
        stroke-width: 5;
    }
    .steam {
        stroke-width: 4;
        opacity: 0.75;
    }
</style>
