<script module lang="ts">
    export type TextAnimationKind =
        | 'wave'
        | 'rainbow'
        | 'shimmer'
        | 'scramble'
        | 'glitch'
        | 'blur-in'
        | 'pop'
        | 'float'
        | 'strike'
        | 'highlight'
        | 'underline-draw'
        | 'squiggle'
        | 'shake'
        | 'drop'
        | 'neon';

    export type TextAnimationTrigger =
        'loop' | 'viewport' | 'once' | 'hover' | 'scroll';

    export type TextAnimationUnit = 'letter' | 'word';

    export type TextAnimationStagger =
        'forward' | 'reverse' | 'center-out' | 'random';

    export type ScrambleCharset = 'alnum' | 'binary' | 'hex' | 'katakana';
</script>

<script lang="ts">
    import { onMount } from 'svelte';

    type Props = {
        text?: string;
        texts?: string[];
        kind: TextAnimationKind;
        trigger?: TextAnimationTrigger;
        unit?: TextAnimationUnit;
        stagger?: TextAnimationStagger;
        charset?: ScrambleCharset;
        style?: string;
        animationDuration?: number;
        delay?: number;
        repeatDelay?: number;
        letterDelay?: number;
        rotateInterval?: number;
        verticalDistance?: number;
        skewAngle?: number;
    };

    const SCRAMBLE_CHARSETS: Record<ScrambleCharset, string> = {
        alnum: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_',
        binary: '01',
        hex: '0123456789ABCDEF',
        katakana:
            'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
    };

    /** kinds rendered as a single gradient-filled span */
    const GRADIENT_KINDS = new Set<TextAnimationKind>(['rainbow', 'shimmer']);
    /** loop keyframes that run `alternate`, so they only rest on even iterations */
    const ALTERNATING_KINDS = new Set<TextAnimationKind>([
        'wave',
        'float',
        'blur-in',
        'rainbow',
    ]);
    /** kinds animated as one block rather than per letter or word */
    const WHOLE_TEXT_KINDS = new Set<TextAnimationKind>([
        'highlight',
        'underline-draw',
        'squiggle',
        'strike',
        'shake',
    ]);

    let {
        text,
        texts,
        kind,
        trigger = 'loop',
        unit = 'letter',
        stagger = 'forward',
        charset = 'alnum',
        style = '',
        animationDuration,
        delay,
        repeatDelay = 0,
        letterDelay = 0.1,
        rotateInterval = 2.4,
        verticalDistance = 5,
        skewAngle = 5,
    }: Props = $props();

    let containerElement = $state<HTMLElement | null>(null);
    let isInViewport = $state(false);
    let hasEnteredOnce = $state(false);
    let isHovered = $state(false);
    let prefersReducedMotion = $state(false);
    let rotationIndex = $state(0);
    let isResting = $state(false);
    let scrollProgress = $state(0);
    let scrambledText = $state<string | null>(null);

    let sources = $derived(texts?.length ? texts : [text ?? '']);
    let activeText = $derived(sources[rotationIndex % sources.length] ?? '');
    let baseSegments = $derived(splitSegments(activeText, unit));
    let displayText = $derived(scrambledText ?? activeText);
    let segments = $derived(splitSegments(displayText, unit));
    let staggerOffsets = $derived(
        computeStagger(segments.length, stagger, activeText),
    );

    let isEntranceTrigger = $derived(
        trigger === 'viewport' || trigger === 'once' || trigger === 'scroll',
    );
    let resolvedAnimationDuration = $derived(
        animationDuration ?? getDefaultDuration(kind, trigger),
    );
    // entering the frame and animating at the same instant reads as a glitch,
    // so anything that fires on scroll waits a beat by default
    let resolvedDelay = $derived(
        delay ?? (trigger === 'viewport' || trigger === 'once' ? 0.5 : 0),
    );
    let usesRepeatDelay = $derived(trigger === 'loop' && repeatDelay > 0);
    let animationIsActive = $derived(
        !prefersReducedMotion &&
            (trigger === 'loop' ||
                (trigger === 'viewport' && isInViewport) ||
                (trigger === 'scroll' && isInViewport) ||
                (trigger === 'once' && hasEnteredOnce) ||
                (trigger === 'hover' && isHovered)),
    );
    let sharedVariables = $derived(
        `--animation-duration: ${resolvedAnimationDuration}s; --animation-delay: ${resolvedDelay}s; --stagger-index: 0;`,
    );
    let ariaLabel = $derived(texts?.length ? texts.join(', ') : (text ?? ''));

    onMount(() => {
        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );
        const updatePreference = () => {
            prefersReducedMotion = mediaQuery.matches;
        };

        updatePreference();
        mediaQuery.addEventListener('change', updatePreference);
        return () => mediaQuery.removeEventListener('change', updatePreference);
    });

    /** rotates through `texts` */
    $effect(() => {
        const total = sources.length;

        if (total < 2 || !animationIsActive) {
            rotationIndex = 0;
            return;
        }

        let index = 0;
        const timer = setInterval(
            () => {
                index = (index + 1) % total;
                rotationIndex = index;
            },
            Math.max(600, rotateInterval * 1000),
        );

        return () => clearInterval(timer);
    });

    /**
     * `repeatDelay` cannot be expressed in CSS, since an infinite animation has
     * no gap between iterations. Instead the animation is paused once it lands
     * back on its starting frame, held there, and released again.
     */
    $effect(() => {
        if (!usesRepeatDelay || prefersReducedMotion) {
            isResting = false;
            return;
        }

        const iterations = ALTERNATING_KINDS.has(kind) ? 2 : 1;
        const longestStagger =
            Math.max(0, baseSegments.length - 1) * letterDelay;
        const playMs = Math.max(
            120,
            (resolvedDelay +
                longestStagger +
                iterations * resolvedAnimationDuration) *
                1000,
        );
        const restMs = Math.max(60, repeatDelay * 1000);
        let timer: ReturnType<typeof setTimeout> | undefined;
        let cancelled = false;

        const play = () => {
            if (cancelled) return;
            isResting = false;
            timer = setTimeout(() => {
                if (cancelled) return;
                isResting = true;
                timer = setTimeout(play, restMs);
            }, playMs);
        };

        play();

        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
            isResting = false;
        };
    });

    /** progress of the element through the viewport, for `trigger="scroll"` */
    $effect(() => {
        if (trigger !== 'scroll' || kind !== 'scramble') return;

        const node = containerElement;
        if (!node) return;

        let frame = 0;
        const measure = () => {
            frame = 0;
            const rect = node.getBoundingClientRect();
            const viewportHeight = window.innerHeight || 1;
            const distance = viewportHeight * 0.65 + rect.height;
            scrollProgress = Math.min(
                1,
                Math.max(0, (viewportHeight - rect.top) / distance),
            );
        };
        const request = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener('scroll', request, { passive: true });
        window.addEventListener('resize', request);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', request);
            window.removeEventListener('resize', request);
        };
    });

    /** churns the text of `scramble` before letting it settle */
    $effect(() => {
        const source = activeText;
        const pool = SCRAMBLE_CHARSETS[charset];
        const duration = resolvedAnimationDuration;
        const loops = trigger === 'loop';

        if (kind !== 'scramble') {
            scrambledText = null;
            return;
        }

        scrambledText = source;
        if (!animationIsActive) return;

        // scroll drives the settle directly instead of a timer
        if (trigger === 'scroll') {
            scrambledText = scrambleFrame(
                Array.from(source),
                scrollProgress,
                pool,
            );
            return;
        }

        const characters = Array.from(source);
        const totalFrames = Math.max(12, characters.length * 2);
        const frameDuration = Math.max(30, (duration * 1000) / totalFrames);
        let timer: ReturnType<typeof setTimeout> | undefined;
        let cancelled = false;

        const runFrame = (frame: number) => {
            if (cancelled) return;

            if (frame >= totalFrames) {
                scrambledText = source;
                if (loops) {
                    timer = setTimeout(
                        () => runFrame(0),
                        Math.max(400, duration * 300),
                    );
                }
                return;
            }

            scrambledText = scrambleFrame(
                characters,
                frame / totalFrames,
                pool,
            );
            timer = setTimeout(() => runFrame(frame + 1), frameDuration);
        };

        timer = setTimeout(() => runFrame(0), resolvedDelay * 1000);

        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
            scrambledText = source;
        };
    });

    function splitSegments(source: string, segmentUnit: TextAnimationUnit) {
        if (segmentUnit === 'word') return source.match(/\s+|\S+/gu) ?? [];
        return Array.from(source);
    }

    function scrambleFrame(
        characters: string[],
        progress: number,
        pool: string,
    ) {
        const settled = Math.floor(progress * characters.length);
        return characters
            .map((character, index) => {
                if (!character.trim() || index < settled) return character;
                return pool[Math.floor(Math.random() * pool.length)];
            })
            .join('');
    }

    function computeStagger(
        count: number,
        mode: TextAnimationStagger,
        seed: string,
    ) {
        if (count <= 0) return [];

        if (mode === 'reverse') {
            return Array.from(
                { length: count },
                (_, index) => count - 1 - index,
            );
        }
        if (mode === 'center-out') {
            const middle = (count - 1) / 2;
            return Array.from({ length: count }, (_, index) =>
                Math.round(Math.abs(index - middle)),
            );
        }
        if (mode === 'random') {
            const order = Array.from({ length: count }, (_, index) => index);
            const random = seededRandom(hashSeed(seed));
            for (let index = order.length - 1; index > 0; index -= 1) {
                const swap = Math.floor(random() * (index + 1));
                [order[index], order[swap]] = [order[swap], order[index]];
            }
            return order;
        }
        return Array.from({ length: count }, (_, index) => index);
    }

    /** deterministic so server and client render the same delays */
    function hashSeed(source: string) {
        let hash = 2166136261;
        for (let index = 0; index < source.length; index += 1) {
            hash ^= source.charCodeAt(index);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function seededRandom(seed: number) {
        let state = seed || 1;
        return () => {
            state = (state + 0x6d2b79f5) | 0;
            let value = Math.imul(state ^ (state >>> 15), 1 | state);
            value =
                (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
            return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
        };
    }

    function segmentVariables(index: number) {
        const offset = staggerOffsets[index] ?? index;
        const staggered = Number(
            (resolvedDelay + offset * letterDelay).toFixed(4),
        );
        return `--animation-duration: ${resolvedAnimationDuration}s; --animation-delay: ${staggered}s; --stagger-index: ${offset}; --wave-vertical: ${verticalDistance}px; --wave-skew: ${skewAngle}deg;`;
    }

    function getDefaultDuration(
        animationKind: TextAnimationKind,
        animationTrigger: TextAnimationTrigger,
    ) {
        const loops = animationTrigger === 'loop';

        switch (animationKind) {
            case 'rainbow':
                return 4;
            case 'shimmer':
                return 2.4;
            case 'scramble':
                return 1.2;
            case 'glitch':
                return loops ? 2.2 : 0.9;
            case 'blur-in':
                return 1;
            case 'pop':
                return 0.9;
            case 'float':
                return 2.8;
            case 'wave':
                return 1.2;
            case 'strike':
                return loops ? 2.6 : 0.9;
            case 'highlight':
                return loops ? 2.8 : 0.85;
            case 'underline-draw':
                return loops ? 2.6 : 0.8;
            case 'squiggle':
                return loops ? 2.6 : 0.9;
            case 'shake':
                return loops ? 2.6 : 0.6;
            case 'drop':
                return loops ? 2.4 : 0.85;
            case 'neon':
                return loops ? 3.2 : 1.4;
        }
    }

    function observeViewport(node: HTMLElement) {
        if (!('IntersectionObserver' in window)) {
            isInViewport = true;
            hasEnteredOnce = true;
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                const visible = entry?.isIntersecting ?? false;
                isInViewport = visible;
                if (visible) hasEnteredOnce = true;
            },
            trigger === 'scroll'
                ? { threshold: 0, rootMargin: '30% 0px 30% 0px' }
                : { threshold: 0, rootMargin: '-10% 0px -10% 0px' },
        );
        observer.observe(node);

        return {
            destroy() {
                observer.disconnect();
                isInViewport = false;
            },
        };
    }

    function trackHover(node: HTMLElement) {
        const start = () => (isHovered = true);
        const stop = () => (isHovered = false);

        node.addEventListener('pointerenter', start);
        node.addEventListener('pointerleave', stop);

        return {
            destroy() {
                node.removeEventListener('pointerenter', start);
                node.removeEventListener('pointerleave', stop);
                isHovered = false;
            },
        };
    }
</script>

<span
    class:active={animationIsActive}
    class:loop={trigger === 'loop'}
    class:resting={isResting}
    class="container"
    data-trigger={trigger}
    data-entrance={isEntranceTrigger}
    {style}
    aria-label={ariaLabel}
    bind:this={containerElement}
    use:observeViewport
    use:trackHover
>
    {#key activeText}
        {#if GRADIENT_KINDS.has(kind)}
            <span
                class="animated-text {kind}"
                aria-hidden="true"
                style={sharedVariables}
            >
                {displayText}
            </span>
        {:else if kind === 'glitch'}
            <span
                class="animated-text glitch"
                aria-hidden="true"
                data-text={displayText}
                style={sharedVariables}
            >
                {displayText}
            </span>
        {:else if WHOLE_TEXT_KINDS.has(kind)}
            <span
                class="animated-text {kind}"
                aria-hidden="true"
                style={sharedVariables}
            >
                {displayText}
            </span>
        {:else}
            <span class="animated-text letters" aria-hidden="true">
                {#each segments as segment, index}
                    <span
                        class:space={!segment.trim()}
                        class={`letter ${kind}-letter`}
                        style={segmentVariables(index)}
                    >
                        {#if kind === 'scramble'}
                            <!-- the ghost holds the settled width so churning
                                 through a charset never reflows the line -->
                            <span class="scramble-ghost"
                                >{baseSegments[index] ?? segment}</span
                            ><span class="scramble-value">{segment}</span>
                        {:else}
                            {segment}
                        {/if}
                    </span>
                {/each}
            </span>
        {/if}
    {/key}
</span>

<style>
    .container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: 'Noto Serif', serif;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .animated-text,
    .letter {
        display: inline-block;
        font: inherit;
    }

    .letter.space {
        width: 1ch;
    }

    /* ------------------------------------------------------------------ wave */

    .active.loop .wave-letter {
        animation: wave-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite alternate;
    }

    .active:not(.loop) .wave-letter {
        animation: wave-once var(--animation-duration) ease-in-out
            var(--animation-delay) both;
    }

    /* --------------------------------------------------------------- rainbow */

    .rainbow {
        color: transparent;
        background-image: linear-gradient(
            90deg,
            #ff3b3b 0%,
            #ff9f1c 14%,
            #ffe45e 28%,
            #4ade80 42%,
            #22d3ee 56%,
            #3b82f6 70%,
            #a855f7 84%,
            #ff3b9d 100%
        );
        background-position: left center;
        background-size: 220% 100%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .active.loop .rainbow {
        animation: rainbow-shift var(--animation-duration) ease-in-out
            var(--animation-delay) infinite alternate;
    }

    .active:not(.loop) .rainbow {
        animation: rainbow-shift var(--animation-duration) ease-in-out
            var(--animation-delay) both;
    }

    /* --------------------------------------------------------------- shimmer */

    .shimmer {
        color: inherit;
        background-image: linear-gradient(
            110deg,
            currentcolor 30%,
            #fff 46%,
            var(--accent) 52%,
            currentcolor 68%
        );
        background-position: 140% center;
        background-size: 250% 100%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .active.loop .shimmer {
        animation: shimmer-sweep var(--animation-duration) linear
            var(--animation-delay) infinite;
    }

    .active:not(.loop) .shimmer {
        animation: shimmer-sweep var(--animation-duration) ease-out
            var(--animation-delay) both;
    }

    /* -------------------------------------------------------------- scramble */

    .scramble-letter {
        position: relative;
    }

    .scramble-ghost {
        visibility: hidden;
    }

    .scramble-value {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* ---------------------------------------------------------------- glitch */

    .glitch {
        position: relative;
    }

    .glitch::before,
    .glitch::after {
        position: absolute;
        inset: 0;
        overflow: hidden;
        content: attr(data-text);
        opacity: 0;
        pointer-events: none;
    }

    .glitch::before {
        color: #22d3ee;
        clip-path: inset(8% 0 52% 0);
    }

    .glitch::after {
        color: #ff3b9d;
        clip-path: inset(54% 0 8% 0);
    }

    .active.loop .glitch,
    .active.loop .glitch::before,
    .active.loop .glitch::after {
        animation-iteration-count: infinite;
    }

    .active:not(.loop) .glitch,
    .active:not(.loop) .glitch::before,
    .active:not(.loop) .glitch::after {
        animation-iteration-count: 1;
        animation-fill-mode: both;
    }

    .active .glitch {
        animation-name: glitch-main;
        animation-duration: var(--animation-duration);
        animation-delay: var(--animation-delay);
        animation-timing-function: steps(1, end);
    }

    .active .glitch::before {
        animation-name: glitch-before;
        animation-duration: var(--animation-duration);
        animation-delay: var(--animation-delay);
        animation-timing-function: steps(1, end);
    }

    .active .glitch::after {
        animation-name: glitch-after;
        animation-duration: var(--animation-duration);
        animation-delay: var(--animation-delay);
        animation-timing-function: steps(1, end);
    }

    /* --------------------------------------------------------------- blur-in */

    .container[data-entrance='true']:not(.active) .blur-in-letter {
        opacity: 0;
        filter: blur(0.45rem);
        transform: translateY(0.4em);
    }

    .active.loop .blur-in-letter {
        animation: blur-breathe var(--animation-duration) ease-in-out
            var(--animation-delay) infinite alternate;
    }

    .container[data-entrance='true'].active .blur-in-letter {
        animation: blur-in var(--animation-duration) ease-out
            var(--animation-delay) both;
    }

    .container[data-trigger='hover'].active .blur-in-letter {
        animation: blur-pulse var(--animation-duration) ease-out
            var(--animation-delay) both;
    }

    /* ------------------------------------------------------------------- pop */

    .container[data-entrance='true']:not(.active) .pop-letter {
        opacity: 0;
        transform: scale(0.55) translateY(0.25em);
    }

    .active.loop .pop-letter {
        animation: pop-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite;
    }

    .container[data-entrance='true'].active .pop-letter {
        animation: pop-in var(--animation-duration)
            cubic-bezier(0.2, 0.9, 0.25, 1.25) var(--animation-delay) both;
    }

    .container[data-trigger='hover'].active .pop-letter {
        animation: pop-pulse var(--animation-duration) ease-in-out
            var(--animation-delay) both;
    }

    /* ----------------------------------------------------------------- float */

    .active.loop .float-letter {
        animation: float-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite alternate;
    }

    .active:not(.loop) .float-letter {
        animation: float-once var(--animation-duration) ease-in-out
            var(--animation-delay) both;
    }

    /* ---------------------------------------------------------------- strike */

    .strike {
        position: relative;
    }

    .strike::after {
        position: absolute;
        top: 55%;
        right: -0.05em;
        left: -0.05em;
        height: 0.075em;
        border-radius: var(--radius-full);
        corner-shape: var(--corner-shape-round, round);
        background: var(--strike-color, currentcolor);
        content: '';
        transform: scaleX(1);
        transform-origin: left center;
    }

    .container[data-entrance='true']:not(.active) .strike::after {
        transform: scaleX(0);
    }

    .active.loop .strike::after {
        animation: strike-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite;
    }

    .active:not(.loop) .strike::after {
        animation: strike-draw var(--animation-duration)
            cubic-bezier(0.2, 0.8, 0.2, 1) var(--animation-delay) both;
    }

    /* ------------------------------------------------------------- highlight */

    .highlight {
        position: relative;
        isolation: isolate;
    }

    .highlight::before {
        position: absolute;
        z-index: -1;
        top: 6%;
        right: -0.2em;
        bottom: 2%;
        left: -0.2em;
        border-radius: 0.2em 0.55em 0.25em 0.45em;
        corner-shape: var(--corner-shape-round, round);
        background: var(--highlight-color, rgb(255 214 92 / 45%));
        content: '';
        transform: skewX(-2.5deg) scaleX(1);
        transform-origin: left center;
    }

    .container[data-entrance='true']:not(.active) .highlight::before {
        transform: skewX(-2.5deg) scaleX(0);
    }

    .active.loop .highlight::before {
        animation: highlight-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite;
    }

    .active:not(.loop) .highlight::before {
        animation: highlight-swipe var(--animation-duration)
            cubic-bezier(0.2, 0.8, 0.2, 1) var(--animation-delay) both;
    }

    /* -------------------------------------------------------- underline-draw */

    .underline-draw {
        position: relative;
    }

    .underline-draw::after {
        position: absolute;
        right: 0;
        bottom: -0.14em;
        left: 0;
        height: 0.08em;
        border-radius: var(--radius-full);
        corner-shape: var(--corner-shape-round, round);
        background: var(--underline-color, var(--accent, currentcolor));
        content: '';
        transform: scaleX(1);
        transform-origin: left center;
    }

    .container[data-entrance='true']:not(.active) .underline-draw::after {
        transform: scaleX(0);
    }

    .active.loop .underline-draw::after {
        animation: underline-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite;
    }

    .active:not(.loop) .underline-draw::after {
        animation: underline-draw var(--animation-duration)
            cubic-bezier(0.2, 0.8, 0.2, 1) var(--animation-delay) both;
    }

    /* -------------------------------------------------------------- squiggle */

    .squiggle {
        --squiggle-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 6'%3E%3Cpath d='M0 4.2 q3 -3.6 6 0 t6 0' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E");

        position: relative;
    }

    .squiggle::after {
        position: absolute;
        right: 0;
        bottom: -0.26em;
        left: 0;
        height: 0.3em;
        background-color: var(--squiggle-color, #ef4444);
        content: '';
        clip-path: inset(0 0 0 0);
        mask-image: var(--squiggle-mask);
        mask-repeat: repeat-x;
        mask-size: 0.62em 0.3em;
        -webkit-mask-image: var(--squiggle-mask);
        -webkit-mask-repeat: repeat-x;
        -webkit-mask-size: 0.62em 0.3em;
    }

    .container[data-entrance='true']:not(.active) .squiggle::after {
        clip-path: inset(0 100% 0 0);
    }

    .active.loop .squiggle::after {
        animation: squiggle-crawl var(--animation-duration) linear
            var(--animation-delay) infinite;
    }

    .active:not(.loop) .squiggle::after {
        animation: squiggle-draw var(--animation-duration) ease-out
            var(--animation-delay) both;
    }

    /* ----------------------------------------------------------------- shake */

    .active.loop .shake {
        animation: shake-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite;
    }

    .active:not(.loop) .shake {
        animation: shake-once var(--animation-duration) ease-in-out
            var(--animation-delay) both;
    }

    /* ------------------------------------------------------------------ drop */

    .container[data-entrance='true']:not(.active) .drop-letter {
        opacity: 0;
        transform: translateY(-0.8em) rotate(-6deg);
    }

    .active.loop .drop-letter {
        animation: drop-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite;
    }

    .active:not(.loop) .drop-letter {
        animation: drop-in var(--animation-duration)
            cubic-bezier(0.24, 0.9, 0.32, 1.2) var(--animation-delay) both;
    }

    /* ------------------------------------------------------------------ neon */

    .neon-letter {
        color: var(--neon-color, var(--accent, #22d3ee));
    }

    .active.loop .neon-letter {
        animation: neon-flicker var(--animation-duration) linear
            var(--animation-delay) infinite;
    }

    .active:not(.loop) .neon-letter {
        animation: neon-start var(--animation-duration) linear
            var(--animation-delay) both;
    }

    /* ------------------------------------------------------------- keyframes */

    @keyframes wave-loop {
        from {
            transform: translateY(calc(-1 * var(--wave-vertical)))
                skew(var(--wave-skew));
        }

        to {
            transform: translateY(var(--wave-vertical))
                skew(calc(-1 * var(--wave-skew)));
        }
    }

    @keyframes wave-once {
        0%,
        100% {
            transform: none;
        }

        30% {
            transform: translateY(calc(-1 * var(--wave-vertical)))
                skew(var(--wave-skew));
        }

        70% {
            transform: translateY(var(--wave-vertical))
                skew(calc(-1 * var(--wave-skew)));
        }
    }

    @keyframes rainbow-shift {
        from {
            background-position: left center;
        }

        to {
            background-position: right center;
        }
    }

    @keyframes shimmer-sweep {
        from {
            background-position: 140% center;
        }

        to {
            background-position: -40% center;
        }
    }

    @keyframes glitch-main {
        0%,
        82%,
        100% {
            transform: none;
        }

        84% {
            transform: translateX(-0.06em) skewX(4deg);
        }

        87% {
            transform: translateX(0.04em) skewX(-2deg);
        }

        90% {
            transform: translateX(-0.02em);
        }
    }

    @keyframes glitch-before {
        0%,
        81%,
        91%,
        100% {
            opacity: 0;
            transform: none;
        }

        83%,
        87% {
            opacity: 0.75;
            transform: translateX(0.09em);
        }

        89% {
            opacity: 0.55;
            transform: translateX(-0.06em);
        }
    }

    @keyframes glitch-after {
        0%,
        83%,
        92%,
        100% {
            opacity: 0;
            transform: none;
        }

        85%,
        89% {
            opacity: 0.7;
            transform: translateX(-0.08em);
        }

        91% {
            opacity: 0.5;
            transform: translateX(0.05em);
        }
    }

    @keyframes blur-in {
        from {
            opacity: 0;
            filter: blur(0.45rem);
            transform: translateY(0.4em);
        }

        to {
            opacity: 1;
            filter: blur(0);
            transform: none;
        }
    }

    @keyframes blur-pulse {
        0%,
        100% {
            filter: blur(0);
            transform: none;
        }

        45% {
            filter: blur(0.18rem);
            transform: translateY(-0.08em);
        }
    }

    @keyframes blur-breathe {
        from {
            opacity: 1;
            filter: blur(0);
        }

        to {
            opacity: 0.82;
            filter: blur(0.08rem);
        }
    }

    @keyframes pop-in {
        from {
            opacity: 0;
            transform: scale(0.55) translateY(0.25em);
        }

        70% {
            opacity: 1;
            transform: scale(1.16) translateY(-0.05em);
        }

        to {
            opacity: 1;
            transform: none;
        }
    }

    @keyframes pop-pulse {
        0%,
        100% {
            transform: none;
        }

        45% {
            transform: scale(1.18) translateY(-0.08em);
        }
    }

    @keyframes pop-loop {
        0%,
        45%,
        100% {
            transform: none;
        }

        18% {
            transform: scale(1.16) translateY(-0.08em);
        }

        30% {
            transform: scale(0.96);
        }
    }

    @keyframes float-loop {
        from {
            transform: translateY(-0.12em) rotate(-0.6deg);
        }

        to {
            transform: translateY(0.12em) rotate(0.6deg);
        }
    }

    @keyframes float-once {
        0%,
        100% {
            transform: none;
        }

        35% {
            transform: translateY(-0.16em) rotate(-0.7deg);
        }

        70% {
            transform: translateY(0.1em) rotate(0.5deg);
        }
    }

    @keyframes strike-draw {
        from {
            transform: scaleX(0);
        }

        to {
            transform: scaleX(1);
        }
    }

    @keyframes strike-loop {
        0% {
            transform: scaleX(0);
        }

        30%,
        76% {
            transform: scaleX(1);
        }

        100% {
            transform: scaleX(0);
        }
    }

    @keyframes highlight-swipe {
        from {
            transform: skewX(-2.5deg) scaleX(0);
        }

        to {
            transform: skewX(-2.5deg) scaleX(1);
        }
    }

    @keyframes highlight-loop {
        0% {
            transform: skewX(-2.5deg) scaleX(0);
        }

        26%,
        78% {
            transform: skewX(-2.5deg) scaleX(1);
        }

        100% {
            transform: skewX(-2.5deg) scaleX(0);
        }
    }

    @keyframes underline-draw {
        from {
            transform: scaleX(0);
        }

        to {
            transform: scaleX(1);
        }
    }

    @keyframes underline-loop {
        0% {
            transform: scaleX(0);
        }

        28%,
        76% {
            transform: scaleX(1);
        }

        100% {
            transform: scaleX(0);
        }
    }

    @keyframes squiggle-draw {
        from {
            clip-path: inset(0 100% 0 0);
        }

        to {
            clip-path: inset(0 0 0 0);
        }
    }

    @keyframes squiggle-crawl {
        0% {
            clip-path: inset(0 100% 0 0);
            mask-position: 0 0;
            -webkit-mask-position: 0 0;
        }

        30%,
        100% {
            clip-path: inset(0 0 0 0);
            mask-position: -1.24em 0;
            -webkit-mask-position: -1.24em 0;
        }
    }

    @keyframes shake-once {
        0%,
        100% {
            transform: none;
        }

        14% {
            transform: translate(-0.07em, 0.025em) rotate(-1.6deg);
        }

        30% {
            transform: translate(0.065em, -0.03em) rotate(1.4deg);
        }

        46% {
            transform: translate(-0.05em, 0.02em) rotate(-1deg);
        }

        62% {
            transform: translate(0.035em, -0.015em) rotate(0.6deg);
        }

        80% {
            transform: translate(-0.018em, 0.005em) rotate(-0.25deg);
        }
    }

    @keyframes shake-loop {
        0%,
        76%,
        100% {
            transform: none;
        }

        79% {
            transform: translate(-0.06em, 0.02em) rotate(-1.4deg);
        }

        82% {
            transform: translate(0.055em, -0.025em) rotate(1.2deg);
        }

        85% {
            transform: translate(-0.04em, 0.03em) rotate(-0.8deg);
        }

        88% {
            transform: translate(0.03em, -0.01em) rotate(0.5deg);
        }

        92% {
            transform: translate(-0.015em, 0) rotate(-0.2deg);
        }
    }

    @keyframes drop-in {
        0% {
            opacity: 0;
            transform: translateY(-0.8em) rotate(-6deg);
        }

        58% {
            opacity: 1;
            transform: translateY(0.06em) rotate(1deg) scaleY(0.9);
        }

        78% {
            transform: translateY(-0.1em) scaleY(1.04);
        }

        100% {
            opacity: 1;
            transform: none;
        }
    }

    @keyframes drop-loop {
        0% {
            opacity: 0;
            transform: translateY(-0.8em) rotate(-6deg);
        }

        18% {
            opacity: 1;
            transform: translateY(0.06em) rotate(1deg) scaleY(0.9);
        }

        26% {
            transform: translateY(-0.1em) scaleY(1.04);
        }

        34%,
        86% {
            opacity: 1;
            transform: none;
        }

        100% {
            opacity: 0;
            transform: translateY(0.5em);
        }
    }

    @keyframes neon-flicker {
        0%,
        16%,
        21%,
        24%,
        54%,
        58%,
        100% {
            opacity: 1;
            text-shadow:
                0 0 0.06em currentcolor,
                0 0 0.35em currentcolor,
                0 0 0.9em currentcolor;
        }

        18%,
        22%,
        56% {
            opacity: 0.5;
            text-shadow: none;
        }
    }

    @keyframes neon-start {
        0%,
        8%,
        18%,
        30% {
            opacity: 0.35;
            text-shadow: none;
        }

        5%,
        12%,
        24% {
            opacity: 1;
            text-shadow:
                0 0 0.06em currentcolor,
                0 0 0.4em currentcolor;
        }

        40%,
        100% {
            opacity: 1;
            text-shadow:
                0 0 0.06em currentcolor,
                0 0 0.35em currentcolor,
                0 0 0.9em currentcolor;
        }
    }

    /* holds the animation on its starting frame for `repeatDelay` seconds,
       rather than resetting it, so nothing snaps between cycles */
    .container.resting .letter,
    .container.resting .animated-text,
    .container.resting .animated-text::before,
    .container.resting .animated-text::after {
        animation-play-state: paused;
    }

    /* --------------------------------------------- scroll-linked scrubbing */

    @supports (animation-timeline: view()) {
        .container[data-trigger='scroll'].active .letter,
        .container[data-trigger='scroll'].active .animated-text {
            animation-timeline: view();
            animation-duration: auto;
            animation-delay: 0s;
            animation-direction: normal;
            animation-iteration-count: 1;
            animation-timing-function: linear;
            animation-range: entry calc(18% + var(--stagger-index, 0) * 3%)
                cover calc(40% + var(--stagger-index, 0) * 3%);
        }

        .container[data-trigger='scroll'].active .animated-text::before,
        .container[data-trigger='scroll'].active .animated-text::after {
            animation-timeline: view();
            animation-duration: auto;
            animation-delay: 0s;
            animation-direction: normal;
            animation-iteration-count: 1;
            animation-timing-function: linear;
            animation-range: entry 18% cover 40%;
        }
    }

    /* ------------------------------------------------------- reduced motion */

    @media (prefers-reduced-motion: reduce) {
        .animated-text,
        .letter {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
            animation: none !important;
        }

        .animated-text::before,
        .animated-text::after {
            animation: none !important;
        }

        .glitch::before,
        .glitch::after {
            display: none;
        }

        .rainbow {
            background-position: center;
        }

        .shimmer {
            color: inherit;
            background: none;
            -webkit-text-fill-color: currentcolor;
        }

        .highlight::before {
            transform: skewX(-2.5deg) scaleX(1) !important;
        }

        .strike::after,
        .underline-draw::after {
            transform: scaleX(1) !important;
        }

        .squiggle::after {
            clip-path: inset(0 0 0 0) !important;
        }
    }
</style>
