<script module lang="ts">
    export type TextAnimationKind =
        | 'wave'
        | 'rainbow'
        | 'shimmer'
        | 'scramble'
        | 'glitch'
        | 'blur-in'
        | 'pop'
        | 'float';

    export type TextAnimationTrigger = 'loop' | 'viewport' | 'hover';
</script>

<script lang="ts">
    import { onMount } from 'svelte';

    type Props = {
        text: string;
        kind: TextAnimationKind;
        trigger?: TextAnimationTrigger;
        style?: string;
        animationDuration?: number;
        letterDelay?: number;
        verticalDistance?: number;
        skewAngle?: number;
    };

    const SCRAMBLE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_';

    let {
        text,
        kind,
        trigger = 'loop',
        style = '',
        animationDuration,
        letterDelay = 0.1,
        verticalDistance = 5,
        skewAngle = 5,
    }: Props = $props();

    let isInViewport = $state(false);
    let isHovered = $state(false);
    let prefersReducedMotion = $state(false);
    let scrambledText = $state<string | null>(null);

    let resolvedAnimationDuration = $derived(
        animationDuration ?? getDefaultDuration(kind),
    );
    let animationIsActive = $derived(
        !prefersReducedMotion &&
            (trigger === 'loop' ||
                (trigger === 'viewport' && isInViewport) ||
                (trigger === 'hover' && isHovered)),
    );

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

    $effect(() => {
        const source = text;
        const shouldAnimate = kind === 'scramble' && animationIsActive;
        const shouldLoop = trigger === 'loop';
        const duration = resolvedAnimationDuration;
        let timer: ReturnType<typeof setTimeout> | undefined;
        let cancelled = false;

        scrambledText = source;
        if (!shouldAnimate) return;

        const sourceCharacters = Array.from(source);
        const totalFrames = Math.max(12, sourceCharacters.length * 2);
        const frameDuration = Math.max(30, (duration * 1000) / totalFrames);

        const runFrame = (frame: number) => {
            if (cancelled) return;

            if (frame >= totalFrames) {
                scrambledText = source;
                if (shouldLoop) {
                    timer = setTimeout(
                        () => runFrame(0),
                        Math.max(400, duration * 300),
                    );
                }
                return;
            }

            const settledCharacters = Math.floor(
                (frame / totalFrames) * sourceCharacters.length,
            );
            scrambledText = sourceCharacters
                .map((character, index) => {
                    if (!character.trim() || index < settledCharacters) {
                        return character;
                    }

                    return SCRAMBLE_CHARACTERS[
                        Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)
                    ];
                })
                .join('');
            timer = setTimeout(() => runFrame(frame + 1), frameDuration);
        };

        runFrame(0);
        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
            scrambledText = source;
        };
    });

    function getDefaultDuration(animationKind: TextAnimationKind) {
        switch (animationKind) {
            case 'rainbow':
                return 4;
            case 'shimmer':
                return 2.4;
            case 'scramble':
                return 1.2;
            case 'glitch':
                return 2.2;
            case 'blur-in':
                return 1;
            case 'pop':
                return 0.9;
            case 'float':
                return 2.8;
            case 'wave':
                return 1.2;
        }
    }

    function observeViewport(node: HTMLElement) {
        if (!('IntersectionObserver' in window)) {
            isInViewport = true;
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                isInViewport = entry?.isIntersecting ?? false;
            },
            { threshold: 0.15 },
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
    class="container"
    data-trigger={trigger}
    {style}
    aria-label={text}
    use:observeViewport
    use:trackHover
>
    {#if kind === 'rainbow' || kind === 'shimmer'}
        <span
            class="animated-text {kind}"
            aria-hidden="true"
            style={`--animation-duration: ${resolvedAnimationDuration}s;`}
        >
            {text}
        </span>
    {:else if kind === 'glitch'}
        <span
            class="animated-text glitch"
            aria-hidden="true"
            data-text={text}
            style={`--animation-duration: ${resolvedAnimationDuration}s;`}
        >
            {text}
        </span>
    {:else}
        {@const renderedText =
            kind === 'scramble' ? (scrambledText ?? text) : text}
        <span class="animated-text letters" aria-hidden="true">
            {#each Array.from(renderedText) as letter, index}
                <span
                    class:space={!letter.trim()}
                    class={`letter ${kind}-letter`}
                    style={`--animation-duration: ${resolvedAnimationDuration}s; --animation-delay: ${index * letterDelay}s; --wave-vertical: ${verticalDistance}px; --wave-skew: ${skewAngle}deg;`}
                >
                    {letter}
                </span>
            {/each}
        </span>
    {/if}
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

    .active.loop .wave-letter {
        animation: wave-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite alternate;
    }

    .active:not(.loop) .wave-letter {
        animation: wave-once var(--animation-duration) ease-in-out
            var(--animation-delay) both;
    }

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
        animation: rainbow-shift var(--animation-duration) ease-in-out infinite
            alternate;
    }

    .active:not(.loop) .rainbow {
        animation: rainbow-shift var(--animation-duration) ease-in-out both;
    }

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
        animation: shimmer-sweep var(--animation-duration) linear infinite;
    }

    .active:not(.loop) .shimmer {
        animation: shimmer-sweep var(--animation-duration) ease-out both;
    }

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
        animation-timing-function: steps(1, end);
    }

    .active .glitch::before {
        animation-name: glitch-before;
        animation-duration: var(--animation-duration);
        animation-timing-function: steps(1, end);
    }

    .active .glitch::after {
        animation-name: glitch-after;
        animation-duration: var(--animation-duration);
        animation-timing-function: steps(1, end);
    }

    .container[data-trigger='viewport']:not(.active) .blur-in-letter {
        opacity: 0;
        filter: blur(0.45rem);
        transform: translateY(0.4em);
    }

    .active.loop .blur-in-letter {
        animation: blur-breathe var(--animation-duration) ease-in-out
            var(--animation-delay) infinite alternate;
    }

    .container[data-trigger='viewport'].active .blur-in-letter {
        animation: blur-in var(--animation-duration) ease-out
            var(--animation-delay) both;
    }

    .container[data-trigger='hover'].active .blur-in-letter {
        animation: blur-pulse var(--animation-duration) ease-out
            var(--animation-delay) both;
    }

    .container[data-trigger='viewport']:not(.active) .pop-letter {
        opacity: 0;
        transform: scale(0.55) translateY(0.25em);
    }

    .active.loop .pop-letter {
        animation: pop-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite;
    }

    .container[data-trigger='viewport'].active .pop-letter {
        animation: pop-in var(--animation-duration)
            cubic-bezier(0.2, 0.9, 0.25, 1.25) var(--animation-delay) both;
    }

    .container[data-trigger='hover'].active .pop-letter {
        animation: pop-pulse var(--animation-duration) ease-in-out
            var(--animation-delay) both;
    }

    .active.loop .float-letter {
        animation: float-loop var(--animation-duration) ease-in-out
            var(--animation-delay) infinite alternate;
    }

    .active:not(.loop) .float-letter {
        animation: float-once var(--animation-duration) ease-in-out
            var(--animation-delay) both;
    }

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
            filter: blur(0);
            opacity: 1;
        }

        to {
            filter: blur(0.08rem);
            opacity: 0.82;
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

    @media (prefers-reduced-motion: reduce) {
        .animated-text,
        .letter,
        .glitch::before,
        .glitch::after {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
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
    }
</style>
