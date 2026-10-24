<script lang="ts">
    import type { AppScreenshot } from '$lib/Projects';
    import { resolveImagePreviewUrl } from '$lib/imagePreviews.js';
    import { tick } from 'svelte';
    import MdChevronLeft from '~icons/mdi/chevron-left';
    import MdChevronRight from '~icons/mdi/chevron-right';
    import MdArrowExpand from '~icons/mdi/arrow-expand';
    import MdClose from '~icons/mdi/close';

    interface Props {
        /** The first one is the cover, and sets the aspect ratio of the frame */
        screenshots: AppScreenshot[];
        /** Shown in the address bar of the browser frame */
        host: string;
        /** Names the gallery for screen readers */
        label: string;
    }

    let { screenshots, host, label }: Props = $props();

    const SWAP_DURATION = 450;
    /** How far a screenshot drifts on its way in or out, as a share of the frame */
    const SWAP_DISTANCE = 6;
    const SWAP_SCALE = 0.97;
    const SWAP_EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
    /** A shorter horizontal drag is a tap or a scroll, not a swipe */
    const SWIPE_DISTANCE = 45;

    let active = $state(0);
    let lightboxOpen = $state(false);
    // Only announced once someone changes the screenshot, not on load
    let announce = $state(false);
    let shotElements = $state<HTMLImageElement[]>([]);
    let thumbElements = $state<HTMLButtonElement[]>([]);
    let dialog = $state<HTMLDialogElement>();
    let swapAnimations: Animation[] = [];
    let lastSwipeAt = 0;

    let cover = $derived(screenshots[0]);
    let current = $derived(screenshots[active] ?? cover);
    let hasMany = $derived(screenshots.length > 1);
    let hasCaptions = $derived(screenshots.some((shot) => shot.caption));

    function preview(src: string) {
        return resolveImagePreviewUrl(src) ?? src;
    }

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /** Shows a screenshot, wrapping around at either end */
    function show(index: number, direction: 1 | -1) {
        const count = screenshots.length;
        const next = ((index % count) + count) % count;
        if (next === active) return;
        const previous = active;
        active = next;
        announce = true;
        if (prefersReducedMotion()) return;
        animateSwap(shotElements[previous], shotElements[next], direction);
    }

    function showPrevious() {
        show(active - 1, -1);
    }

    function showNext() {
        show(active + 1, 1);
    }

    function select(index: number) {
        show(index, index > active ? 1 : -1);
    }

    /**
     * The old screenshot drifts off one way while the new one comes in from the
     * other. Classes already hold the end state, so the animations only run on top
     * of it and an interrupted one can simply be cancelled.
     */
    function animateSwap(
        outgoing: HTMLElement | undefined,
        incoming: HTMLElement | undefined,
        direction: 1 | -1,
    ) {
        for (const animation of swapAnimations) animation.cancel();
        const timing = { duration: SWAP_DURATION, easing: SWAP_EASING };
        const away = (side: number) =>
            `translateX(${side * SWAP_DISTANCE}%) scale(${SWAP_SCALE})`;
        const settled = 'translateX(0%) scale(1)';
        swapAnimations = [
            outgoing?.animate(
                [
                    { opacity: 1, transform: settled },
                    { opacity: 0, transform: away(-direction) },
                ],
                timing,
            ),
            incoming?.animate(
                [
                    { opacity: 0, transform: away(direction) },
                    { opacity: 1, transform: settled },
                ],
                timing,
            ),
        ].filter((animation): animation is Animation => !!animation);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (!hasMany) return;
        if (event.key === 'ArrowLeft') showPrevious();
        else if (event.key === 'ArrowRight') showNext();
        else if (event.key === 'Home') select(0);
        else if (event.key === 'End') select(screenshots.length - 1);
        else return;
        event.preventDefault();
        // Arrowing along the thumbnails moves the focus with the selection
        if (thumbElements.includes(event.target as HTMLButtonElement)) {
            thumbElements[active]?.focus();
        }
    }

    function handleLightboxKeydown(event: KeyboardEvent) {
        if (!hasMany) return;
        if (event.key === 'ArrowLeft') showPrevious();
        else if (event.key === 'ArrowRight') showNext();
        else return;
        event.preventDefault();
    }

    /** Horizontal swipes on a touch screen step through the screenshots */
    function swipe(node: HTMLElement) {
        let start: { x: number; y: number; pointerId: number } | null = null;

        const handleDown = (event: PointerEvent) => {
            if (event.pointerType !== 'touch') return;
            start = {
                x: event.clientX,
                y: event.clientY,
                pointerId: event.pointerId,
            };
        };
        const handleUp = (event: PointerEvent) => {
            if (!start || start.pointerId !== event.pointerId) return;
            const horizontal = event.clientX - start.x;
            const vertical = event.clientY - start.y;
            start = null;
            if (
                !hasMany ||
                Math.abs(horizontal) < SWIPE_DISTANCE ||
                Math.abs(horizontal) <= Math.abs(vertical)
            ) {
                return;
            }
            if (horizontal > 0) showPrevious();
            else showNext();
            lastSwipeAt = performance.now();
        };
        const handleCancel = () => (start = null);

        node.addEventListener('pointerdown', handleDown);
        node.addEventListener('pointerup', handleUp);
        node.addEventListener('pointercancel', handleCancel);
        return {
            destroy() {
                node.removeEventListener('pointerdown', handleDown);
                node.removeEventListener('pointerup', handleUp);
                node.removeEventListener('pointercancel', handleCancel);
            },
        };
    }

    async function openLightbox() {
        // The tap that ends a swipe is not a request to enlarge
        if (performance.now() - lastSwipeAt < 500) return;
        lightboxOpen = true;
        await tick();
        dialog?.showModal();
    }

    function closeLightbox() {
        dialog?.close();
    }

    /** A click anywhere but on the screenshot, its caption or a button closes it */
    function handleDialogClick(event: MouseEvent) {
        const target = event.target as Element;
        if (!target.closest('img, button, .lightbox-caption')) closeLightbox();
    }
</script>

<figure
    class="gallery"
    aria-roledescription={hasMany ? 'carousel' : undefined}
    aria-label={label}
    style="--ratio: {cover.width} / {cover.height}"
>
    <div class="window">
        <div class="window-bar" aria-hidden="true">
            <span class="window-dots">
                <span></span><span></span><span></span>
            </span>
            <span class="window-url">{host}</span>
            {#if hasMany}
                <span class="window-count">
                    {active + 1}/{screenshots.length}
                </span>
            {/if}
        </div>
        <!-- Every screenshot is in the markup with its alt text, so crawlers see all
             of them, but only the cover loads eagerly -->
        <div class="screen" use:swipe>
            {#each screenshots as screenshot, i (screenshot.src)}
                <img
                    bind:this={shotElements[i]}
                    class="shot"
                    class:active={i === active}
                    src={preview(screenshot.src)}
                    alt={screenshot.alt}
                    width={screenshot.width}
                    height={screenshot.height}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchpriority={i === 0 ? 'high' : undefined}
                    aria-hidden={i === active ? undefined : 'true'}
                    draggable="false"
                />
            {/each}
            <button
                class="enlarge"
                type="button"
                aria-haspopup="dialog"
                aria-label="Enlarge the screenshot"
                onclick={openLightbox}
                onkeydown={handleKeydown}
            >
                <span class="control enlarge-hint" aria-hidden="true">
                    <span class="control-icon"><MdArrowExpand /></span>
                </span>
            </button>
            {#if hasMany}
                <button
                    class="control step step-previous"
                    type="button"
                    aria-label="Previous screenshot"
                    onclick={showPrevious}
                    onkeydown={handleKeydown}
                >
                    <span class="control-icon"><MdChevronLeft /></span>
                </button>
                <button
                    class="control step step-next"
                    type="button"
                    aria-label="Next screenshot"
                    onclick={showNext}
                    onkeydown={handleKeydown}
                >
                    <span class="control-icon"><MdChevronRight /></span>
                </button>
            {/if}
        </div>
    </div>

    {#if hasMany}
        <div class="thumbs" role="group" aria-label="Choose a screenshot">
            {#each screenshots as screenshot, i (screenshot.src)}
                <button
                    bind:this={thumbElements[i]}
                    class="thumb"
                    class:active={i === active}
                    type="button"
                    aria-label="Screenshot {i + 1} of {screenshots.length}"
                    aria-current={i === active ? 'true' : undefined}
                    onclick={() => select(i)}
                    onkeydown={handleKeydown}
                >
                    <img
                        src={preview(screenshot.src)}
                        alt=""
                        width={screenshot.width}
                        height={screenshot.height}
                        loading="lazy"
                        draggable="false"
                    />
                </button>
            {/each}
        </div>
        <p class="sr-only" aria-live="polite" aria-atomic="true">
            {#if announce}
                Screenshot {active + 1} of {screenshots.length}: {current.alt}
            {/if}
        </p>
    {/if}

    <!-- Every caption sits in the same cell, so the tallest one sets its height and
         switching never moves what is below -->
    {#if hasCaptions}
        <figcaption class="captions">
            {#each screenshots as screenshot, i (screenshot.src)}
                <span
                    class="caption"
                    class:active={i === active}
                    aria-hidden={i === active ? undefined : 'true'}
                >
                    {screenshot.caption ?? ''}
                </span>
            {/each}
        </figcaption>
    {/if}
</figure>

<!-- A sibling of the gallery, so its arrow keys do not also reach the gallery's.
     showModal() traps the focus, closes on Escape and gives it back on close. -->
<dialog
    bind:this={dialog}
    class="lightbox"
    aria-label="{label}, enlarged"
    onclose={() => (lightboxOpen = false)}
    onclick={handleDialogClick}
    onkeydown={handleLightboxKeydown}
>
    {#if lightboxOpen}
        <button
            class="control lightbox-close"
            type="button"
            aria-label="Close"
            onclick={closeLightbox}
        >
            <span class="control-icon"><MdClose /></span>
        </button>
        <div class="lightbox-stage" use:swipe>
            {#key current.src}
                <img
                    class="lightbox-image"
                    src={current.src}
                    alt={current.alt}
                    width={current.width}
                    height={current.height}
                    style="--ratio: {current.width / current.height}"
                    draggable="false"
                />
            {/key}
        </div>
        <div class="lightbox-bar" class:many={hasMany}>
            {#if hasMany}
                <button
                    class="control"
                    type="button"
                    aria-label="Previous screenshot"
                    onclick={showPrevious}
                >
                    <span class="control-icon"><MdChevronLeft /></span>
                </button>
            {/if}
            <p class="lightbox-caption">
                {#if hasMany}
                    <span class="lightbox-count">
                        {active + 1} / {screenshots.length}
                    </span>
                {/if}
                {current.caption ?? current.alt}
            </p>
            {#if hasMany}
                <button
                    class="control"
                    type="button"
                    aria-label="Next screenshot"
                    onclick={showNext}
                >
                    <span class="control-icon"><MdChevronRight /></span>
                </button>
            {/if}
        </div>
    {/if}
</dialog>

<style lang="scss">
    /* Reads the accent custom properties of the app page around it */
    .gallery {
        perspective: 1600px;
    }

    .window {
        border-radius: var(--radius-2xl);
        overflow: hidden;
        background-color: #1c2029;
        border: solid 1px rgb(255 255 255 / 9%);
        box-shadow:
            0 2rem 4rem -1.5rem rgb(0 0 0 / 70%),
            0 0 0 1px rgb(0 0 0 / 30%);
        transform: rotateY(-7deg) rotateX(3deg);
        transform-origin: left center;
        transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.46, 1);
    }
    /* :focus-visible rather than :focus-within, so a click does not hold it flat */
    .gallery:hover .window,
    .gallery:has(:focus-visible) .window {
        transform: none;
    }

    .window-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.55rem 0.8rem;
        background-color: #232833;
        border-bottom: solid 1px rgb(255 255 255 / 6%);
    }
    .window-dots {
        display: flex;
        gap: 0.35rem;
        > span {
            width: 0.6rem;
            height: 0.6rem;
            border-radius: var(--radius-full);
            corner-shape: var(--corner-shape-round, round);
            background-color: rgb(255 255 255 / 18%);
        }
    }
    .window-url {
        flex: 1;
        max-width: 18rem;
        margin: 0 auto;
        padding: 0.2rem 0.8rem;
        border-radius: var(--radius-full);
        corner-shape: var(--corner-shape-round, round);
        background-color: rgb(0 0 0 / 25%);
        color: #9a9aab;
        font-family: 'Fira Code', monospace;
        font-size: 0.75rem;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .window-count {
        min-width: 2.4rem;
        color: #9a9aab;
        font-family: 'Fira Code', monospace;
        font-size: 0.75rem;
        text-align: right;
    }

    /* The cover's ratio is reserved before any image loads; a screenshot of another
       shape is letterboxed rather than cropped */
    .screen {
        position: relative;
        aspect-ratio: var(--ratio);
        overflow: hidden;
        touch-action: pan-y;
    }
    .shot {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
        opacity: 0;
        user-select: none;
        &.active {
            opacity: 1;
        }
    }

    .control {
        display: grid;
        place-items: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: var(--radius-full);
        corner-shape: var(--corner-shape-round, round);
        color: #e4e4e4;
        background-color: rgb(16 18 24 / 72%);
        backdrop-filter: blur(8px);
        box-shadow:
            0 0.4rem 1.2rem rgb(0 0 0 / 35%),
            inset 0 0 0 1px rgb(255 255 255 / 10%);
        cursor: pointer;
        transition:
            opacity 0.2s,
            transform 0.2s,
            background-color 0.2s,
            color 0.2s;
    }
    button.control:hover {
        background-color: var(--app-color-fill);
        color: var(--app-color-on-fill);
    }
    button.control:focus-visible,
    .thumb:focus-visible {
        outline: 2px solid var(--app-color-text);
        outline-offset: 2px;
    }
    /* Clear of the ring that marks the active thumbnail */
    .thumb:focus-visible {
        outline-offset: 4px;
    }
    .control-icon {
        display: flex;
        width: 1.4rem;
    }

    .enlarge {
        position: absolute;
        inset: 0;
        z-index: 1;
        background: transparent;
        cursor: zoom-in;
        &:focus-visible {
            outline: 2px solid var(--app-color-text);
            outline-offset: -2px;
        }
    }
    .enlarge-hint {
        position: absolute;
        top: 0.7rem;
        right: 0.7rem;
        width: 2.2rem;
        height: 2.2rem;
        opacity: 0;
        .control-icon {
            width: 1.1rem;
        }
    }

    /* Out of the way until the pointer or the focus is on the gallery */
    .step {
        --nudge: 0.4rem;
        position: absolute;
        top: 50%;
        z-index: 2;
        opacity: 0;
    }
    .step-previous {
        left: 0.7rem;
        transform: translate(calc(var(--nudge) * -1), -50%);
    }
    .step-next {
        right: 0.7rem;
        transform: translate(var(--nudge), -50%);
    }
    .gallery:hover,
    .gallery:has(:focus-visible) {
        .step {
            --nudge: 0rem;
            opacity: 1;
        }
        .enlarge-hint {
            opacity: 1;
        }
    }

    .thumbs {
        display: flex;
        justify-content: center;
        gap: 0.6rem;
        margin-top: 1.1rem;
    }
    .thumb {
        flex: 0 1 5.5rem;
        min-width: 0;
        aspect-ratio: var(--ratio);
        padding: 0;
        overflow: hidden;
        border-radius: var(--radius-md);
        background-color: #1c2029;
        box-shadow: 0 0 0 1px rgb(255 255 255 / 10%);
        opacity: 0.5;
        cursor: pointer;
        transition:
            opacity 0.2s,
            transform 0.2s,
            box-shadow 0.2s;
        > img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
        }
        &:hover {
            opacity: 0.85;
            transform: translateY(-0.1rem);
        }
        &.active {
            opacity: 1;
            box-shadow:
                0 0 0 2px var(--app-color-text),
                0 0.5rem 1.2rem -0.3rem
                    color-mix(in srgb, var(--app-color) 60%, transparent);
        }
    }

    .captions {
        display: grid;
        margin-top: 0.9rem;
    }
    .caption {
        grid-area: 1 / 1;
        color: #b9b9c4;
        font-size: 0.95rem;
        line-height: 1.45;
        text-align: center;
        opacity: 0;
        transition: opacity 0.3s;
        &.active {
            opacity: 1;
        }
    }

    /* ------------------------------------------------------------ lightbox -- */
    .lightbox {
        width: 100%;
        height: 100%;
        max-width: none;
        max-height: none;
        margin: 0;
        padding: 1rem;
        border: none;
        background: transparent;
        color: #dbdbdb;
        overflow: hidden;
    }
    .lightbox[open] {
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
        place-items: center;
        gap: 1rem;
        animation: lightbox-in 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .lightbox::backdrop {
        background-color: rgb(7 9 13 / 88%);
        backdrop-filter: blur(10px);
    }
    :global(html:has(.lightbox[open])) {
        overflow: hidden;
    }

    .lightbox-stage {
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        min-height: 0;
        touch-action: pan-y;
    }
    /* Sized from its ratio rather than from the loaded file, so it takes its final
       size at once */
    .lightbox-image {
        width: min(100%, calc((100dvh - 7.5rem) * var(--ratio)));
        height: auto;
        border-radius: var(--radius-xl);
        box-shadow: 0 1.5rem 4rem rgb(0 0 0 / 50%);
        user-select: none;
        animation: fade-in 0.3s ease-out;
    }

    .lightbox-bar {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        align-items: center;
        gap: 1rem;
        width: min(44rem, 100%);
        &.many {
            grid-template-columns: 2.5rem minmax(0, 1fr) 2.5rem;
        }
    }
    .lightbox-caption {
        font-size: 0.95rem;
        line-height: 1.4;
        text-align: center;
    }
    .lightbox-count {
        margin-right: 0.5rem;
        color: var(--app-color-text);
        font-family: 'Fira Code', monospace;
        font-size: 0.85rem;
    }
    .lightbox-close {
        position: fixed;
        top: max(1rem, env(safe-area-inset-top));
        right: max(1rem, env(safe-area-inset-right));
        z-index: 1;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    @keyframes lightbox-in {
        from {
            opacity: 0;
            transform: scale(0.97);
        }
    }
    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }

    /* Touch screens have no hover to reveal the controls with */
    @media (hover: none) {
        .step,
        .enlarge-hint {
            --nudge: 0rem;
            opacity: 1;
        }
        .step {
            width: 2.2rem;
            height: 2.2rem;
        }
    }

    @media (max-width: 900px) {
        .window {
            transform: none;
        }
    }

    @media (max-width: 650px) {
        .thumbs {
            gap: 0.45rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .window,
        .control,
        .thumb,
        .caption {
            transition: none;
        }
        .lightbox[open],
        .lightbox-image {
            animation: none;
        }
    }
</style>
