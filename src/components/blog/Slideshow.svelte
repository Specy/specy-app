<script module lang="ts">
    export type SlideshowPhoto = {
        src: string;
        alt?: string;
        preview?: string;
    };
</script>

<script lang="ts">
    import { getImagePreviewUrl } from '$lib/imagePreviews.js';
    import { onDestroy, tick } from 'svelte';
    import FaChevronLeft from '~icons/fa-solid/chevron-left';
    import FaChevronRight from '~icons/fa-solid/chevron-right';

    type PhotoInput = string | SlideshowPhoto;

    type NormalizedPhoto = {
        src: string;
        alt: string;
        preview: string;
    };

    type ViewTransitionDocument = Document & {
        startViewTransition?: (update: () => void | Promise<void>) => {
            finished: Promise<void>;
        };
    };

    type Props = {
        photos: PhotoInput[];
        label?: string;
    };

    type PreloadedImage = {
        image: HTMLImageElement;
        status: 'loading' | 'loaded' | 'error';
        promise: Promise<boolean>;
    };

    const IMAGE_TRANSITION_NAME = 'slideshow-expanded-image';

    let { photos, label = 'Photo slideshow' }: Props = $props();

    let activeIndex = $state(0);
    let expandedPhoto = $state<NormalizedPhoto | null>(null);
    let fullResolutionSrc = $state<string | null>(null);
    let fullResolutionLoaded = $state(false);
    let fullResolutionFailed = $state(false);
    let expandedFullImage = $state<HTMLImageElement>();
    let closeButton = $state<HTMLButtonElement>();
    let sourceTrigger: HTMLButtonElement | null = null;
    let sourceImage: HTMLImageElement | null = null;
    let transitionInProgress = false;
    let previousBodyOverflow: string | null = null;
    let previousBodyPaddingRight: string | null = null;
    let touchStart: { x: number; y: number; pointerId: number } | null = null;
    let suppressNextImageClick = false;
    let slideshowInViewport = $state(false);
    const preloadedFullResolution = new Map<string, PreloadedImage>();

    let normalizedPhotos = $derived(
        photos
            .map((photo): NormalizedPhoto | null => {
                const normalized =
                    typeof photo === 'string' ? { src: photo, alt: '' } : photo;

                if (!normalized.src) return null;

                return {
                    src: normalized.src,
                    alt: normalized.alt ?? '',
                    preview:
                        normalized.preview ??
                        getImagePreviewUrl(normalized.src) ??
                        normalized.src,
                };
            })
            .filter((photo): photo is NormalizedPhoto => photo !== null),
    );

    $effect(() => {
        if (activeIndex >= normalizedPhotos.length) activeIndex = 0;
    });

    $effect(() => {
        if (!slideshowInViewport) return;

        const selectedPhoto = normalizedPhotos[activeIndex];
        if (selectedPhoto) preloadFullResolution(selectedPhoto.src);
    });

    function getRelativeOffset(index: number) {
        return index - activeIndex;
    }

    function selectPhoto(index: number) {
        const photo = normalizedPhotos[index];
        if (!photo) return;

        activeIndex = index;
    }

    function showPrevious() {
        if (activeIndex === 0) return;
        selectPhoto(activeIndex - 1);
    }

    function showNext() {
        const count = normalizedPhotos.length;
        if (activeIndex >= count - 1) return;
        selectPhoto(activeIndex + 1);
    }

    function handleSlideshowKeydown(event: KeyboardEvent) {
        if (expandedPhoto) return;

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showPrevious();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            showNext();
        }
    }

    function handleTouchStart(event: PointerEvent) {
        if (event.pointerType !== 'touch') return;
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
        touchStart = {
            x: event.clientX,
            y: event.clientY,
            pointerId: event.pointerId,
        };
    }

    function handleTouchEnd(event: PointerEvent) {
        if (!touchStart || touchStart.pointerId !== event.pointerId) return;

        const horizontalDistance = event.clientX - touchStart.x;
        const verticalDistance = event.clientY - touchStart.y;
        touchStart = null;

        if (
            Math.abs(horizontalDistance) < 45 ||
            Math.abs(horizontalDistance) <= Math.abs(verticalDistance)
        ) {
            return;
        }

        if (horizontalDistance > 0) showPrevious();
        else showNext();

        suppressNextImageClick = true;
        setTimeout(() => (suppressNextImageClick = false), 0);
    }

    function handleImageClick(index: number, trigger: HTMLButtonElement) {
        if (suppressNextImageClick) {
            suppressNextImageClick = false;
            return;
        }

        if (index !== activeIndex) {
            selectPhoto(index);
            return;
        }

        void openImage(index, trigger);
    }

    function touchSwipe(node: HTMLElement) {
        const cancelTouch = () => (touchStart = null);

        node.addEventListener('pointerdown', handleTouchStart);
        node.addEventListener('pointerup', handleTouchEnd);
        node.addEventListener('pointercancel', cancelTouch);

        return {
            destroy() {
                node.removeEventListener('pointerdown', handleTouchStart);
                node.removeEventListener('pointerup', handleTouchEnd);
                node.removeEventListener('pointercancel', cancelTouch);
            },
        };
    }

    function observeViewport(node: HTMLElement) {
        if (!('IntersectionObserver' in window)) {
            slideshowInViewport = true;
            return {
                destroy() {
                    slideshowInViewport = false;
                },
            };
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                slideshowInViewport = entry?.isIntersecting ?? false;
            },
            { threshold: 0.01 },
        );
        observer.observe(node);

        return {
            destroy() {
                observer.disconnect();
                slideshowInViewport = false;
            },
        };
    }

    function handleWindowKeydown(event: KeyboardEvent) {
        if (!expandedPhoto) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            void closeImage();
        } else if (event.key === 'Tab') {
            event.preventDefault();
            closeButton?.focus({ preventScroll: true });
        }
    }

    async function openImage(index: number, trigger: HTMLButtonElement) {
        const photo = normalizedPhotos[index];
        if (!photo || expandedPhoto || transitionInProgress) return;

        const preloadedImage = preloadedFullResolution.get(photo.src);
        const fullResolutionIsReady = preloadedImage?.status === 'loaded';

        transitionInProgress = true;
        sourceTrigger = trigger;
        sourceImage = trigger.querySelector('.slide-image');
        fullResolutionSrc = fullResolutionIsReady ? photo.src : null;
        fullResolutionLoaded = fullResolutionIsReady;
        fullResolutionFailed = false;
        sourceImage?.style.setProperty(
            'view-transition-name',
            IMAGE_TRANSITION_NAME,
        );

        await runImageTransition(async () => {
            sourceImage?.style.removeProperty('view-transition-name');
            expandedPhoto = photo;
            lockBodyScroll();
            await tick();
        });

        if (!fullResolutionIsReady) void revealFullResolution(photo);
        closeButton?.focus({ preventScroll: true });
        transitionInProgress = false;
    }

    function preloadFullResolution(src: string) {
        const existing = preloadedFullResolution.get(src);
        if (existing) return existing;

        const image = new Image();
        const entry: PreloadedImage = {
            image,
            status: 'loading',
            promise: Promise.resolve(false),
        };

        image.decoding = 'async';
        image.fetchPriority = 'high';
        image.src = src;
        entry.promise = image.decode().then(
            () => {
                entry.status = 'loaded';
                return true;
            },
            () => {
                entry.status = 'error';
                preloadedFullResolution.delete(src);
                return false;
            },
        );
        preloadedFullResolution.set(src, entry);
        return entry;
    }

    async function revealFullResolution(photo: NormalizedPhoto) {
        const decoded = await preloadFullResolution(photo.src).promise;
        if (expandedPhoto?.src !== photo.src) return;

        if (!decoded) {
            fullResolutionFailed = true;
            return;
        }

        fullResolutionSrc = photo.src;
        await tick();

        const image = expandedFullImage;
        if (!image) return;

        try {
            await image.decode();
        } catch {
            if (expandedPhoto?.src === photo.src) {
                fullResolutionFailed = true;
            }
            return;
        }

        await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        if (expandedPhoto?.src === photo.src && expandedFullImage === image) {
            fullResolutionLoaded = true;
        }
    }

    async function closeImage() {
        if (!expandedPhoto || transitionInProgress) return;

        transitionInProgress = true;
        const trigger = sourceTrigger;
        const image = sourceImage;

        await runImageTransition(async () => {
            expandedPhoto = null;
            fullResolutionSrc = null;
            fullResolutionLoaded = false;
            fullResolutionFailed = false;
            unlockBodyScroll();
            await tick();

            if (image?.isConnected) {
                image.style.viewTransitionName = IMAGE_TRANSITION_NAME;
            }
        });

        image?.style.removeProperty('view-transition-name');
        trigger?.focus({ preventScroll: true });
        sourceTrigger = null;
        sourceImage = null;
        transitionInProgress = false;
    }

    async function runImageTransition(update: () => void | Promise<void>) {
        const transitionDocument = document as ViewTransitionDocument;
        const reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        if (!transitionDocument.startViewTransition || reducedMotion) {
            await update();
            return;
        }

        try {
            await transitionDocument.startViewTransition(update).finished;
        } catch {
            // Navigations and other document transitions can interrupt this.
            // The state update itself has already happened.
        }
    }

    function lockBodyScroll() {
        if (previousBodyOverflow !== null) return;

        const body = document.body;
        const viewportWidthBefore = document.documentElement.clientWidth;
        const bodyPaddingRight =
            Number.parseFloat(getComputedStyle(body).paddingRight) || 0;

        previousBodyOverflow = body.style.overflow;
        previousBodyPaddingRight = body.style.paddingRight;
        body.style.overflow = 'hidden';

        const removedScrollbarWidth =
            document.documentElement.clientWidth - viewportWidthBefore;

        if (removedScrollbarWidth > 0) {
            body.style.paddingRight = `${bodyPaddingRight + removedScrollbarWidth}px`;
        }
    }

    function unlockBodyScroll() {
        if (previousBodyOverflow === null) return;

        document.body.style.overflow = previousBodyOverflow;
        document.body.style.paddingRight = previousBodyPaddingRight ?? '';
        previousBodyOverflow = null;
        previousBodyPaddingRight = null;
    }

    onDestroy(() => {
        sourceImage?.style.removeProperty('view-transition-name');
        preloadedFullResolution.clear();
        unlockBodyScroll();
    });
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if normalizedPhotos.length > 0}
    <div
        class:single={normalizedPhotos.length === 1}
        class="slideshow"
        use:observeViewport
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
    >
        <div class="slideshow-viewport" use:touchSwipe>
            {#each normalizedPhotos as photo, index (`${photo.src}-${index}`)}
                {@const offset = getRelativeOffset(index)}
                {@const distance = Math.abs(offset)}
                {@const isActive = index === activeIndex}
                <div
                    class:active={isActive}
                    class:previous={offset === -1}
                    class:next={offset === 1}
                    class:hidden={distance > 1}
                    class="slide"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${normalizedPhotos.length}`}
                    style={`--slide-offset: ${offset * 72}%; --slide-scale: ${isActive ? 1 : 0.86};`}
                >
                    <button
                        class="image-trigger"
                        type="button"
                        tabindex={isActive ? 0 : -1}
                        aria-current={isActive ? 'true' : undefined}
                        aria-haspopup="dialog"
                        aria-label={isActive
                            ? photo.alt
                                ? `Open ${photo.alt} fullscreen`
                                : `Open photo ${index + 1} fullscreen`
                            : photo.alt
                              ? `Show ${photo.alt}`
                              : `Show photo ${index + 1}`}
                        onclick={(event) =>
                            handleImageClick(index, event.currentTarget)}
                        onkeydown={handleSlideshowKeydown}
                    >
                        <img
                            class="slide-image"
                            src={photo.preview}
                            alt={photo.alt}
                            loading={distance <= 1 ? 'eager' : 'lazy'}
                            decoding="async"
                            draggable="false"
                        />
                    </button>
                </div>
            {/each}
        </div>

        {#if normalizedPhotos.length > 1}
            <div class="slideshow-controls">
                <button
                    class="slideshow-control previous-control"
                    type="button"
                    aria-label="Show previous photo"
                    disabled={activeIndex === 0}
                    onclick={showPrevious}
                    onkeydown={handleSlideshowKeydown}
                >
                    <span class="control-icon" aria-hidden="true">
                        <FaChevronLeft />
                    </span>
                </button>

                <div
                    class="slideshow-pagination"
                    role="group"
                    aria-label="Choose a photo"
                >
                    {#each normalizedPhotos as photo, index (`page-${photo.src}-${index}`)}
                        <button
                            class:active={index === activeIndex}
                            type="button"
                            aria-label={`Show photo ${index + 1}`}
                            aria-current={index === activeIndex
                                ? 'true'
                                : undefined}
                            onclick={() => selectPhoto(index)}
                            onkeydown={handleSlideshowKeydown}
                        ></button>
                    {/each}
                </div>

                <button
                    class="slideshow-control next-control"
                    type="button"
                    aria-label="Show next photo"
                    disabled={activeIndex === normalizedPhotos.length - 1}
                    onclick={showNext}
                    onkeydown={handleSlideshowKeydown}
                >
                    <span class="control-icon" aria-hidden="true">
                        <FaChevronRight />
                    </span>
                </button>
            </div>

            <div class="sr-only" aria-live="polite" aria-atomic="true">
                Photo {activeIndex + 1} of {normalizedPhotos.length}
            </div>
        {/if}
    </div>
{/if}

{#if expandedPhoto}
    <div
        class="image-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={expandedPhoto.alt
            ? `Fullscreen view of ${expandedPhoto.alt}`
            : 'Fullscreen image viewer'}
    >
        <button
            class="image-lightbox-backdrop"
            type="button"
            tabindex="-1"
            aria-label="Close fullscreen image"
            onclick={closeImage}
        ></button>
        <div
            class="expanded-image-frame"
            style={`view-transition-name: ${IMAGE_TRANSITION_NAME}`}
        >
            <img
                class="expanded-image-preview"
                src={expandedPhoto.preview}
                alt=""
                aria-hidden="true"
            />
            {#if fullResolutionSrc}
                <img
                    bind:this={expandedFullImage}
                    class:loaded={fullResolutionLoaded}
                    class="expanded-image-full"
                    src={fullResolutionSrc}
                    alt={expandedPhoto.alt}
                />
            {/if}
        </div>
        {#if !fullResolutionLoaded && !fullResolutionFailed}
            <div class="image-lightbox-status" role="status" aria-live="polite">
                <span class="loading-spinner" aria-hidden="true"></span>
                <span class="sr-only">Loading full-resolution image</span>
            </div>
        {:else if fullResolutionFailed}
            <div
                class="image-lightbox-status quality-unavailable"
                role="status"
            >
                Preview only
            </div>
        {/if}
        <button
            bind:this={closeButton}
            class="image-lightbox-close"
            type="button"
            aria-label="Close fullscreen image"
            onclick={closeImage}
        >
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
{/if}

<style lang="scss">
    :global(::view-transition-group(slideshow-expanded-image)) {
        z-index: 10001;
        animation-duration: 420ms;
        animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    :global(::view-transition-group(slideshow-image-backdrop)) {
        z-index: 10000;
        animation-duration: 260ms;
        animation-timing-function: ease-out;
    }

    .slideshow {
        --slideshow-height: min(70vh, clamp(20rem, 56vw, 42rem));
        --slideshow-controls-height: 4.5rem;
        --slideshow-shadow-top-space: 1rem;

        position: relative;
        left: 50%;
        width: min(76rem, calc(100vw - 1rem));
        margin: 2.5rem 0;
        transform: translateX(-50%);
        touch-action: pan-y;
    }

    .slideshow-viewport {
        position: relative;
        height: calc(
            var(--slideshow-height) + var(--slideshow-controls-height) +
                var(--slideshow-shadow-top-space)
        );
        overflow: hidden;
        perspective: 80rem;
        -webkit-mask-image:
            linear-gradient(
                to right,
                transparent 0%,
                black 20%,
                black 80%,
                transparent 100%
            ),
            radial-gradient(
                ellipse 70% 140% at center,
                black 55%,
                transparent 100%
            );
        -webkit-mask-composite: source-in;
        mask-image:
            linear-gradient(
                to right,
                transparent 0%,
                black 20%,
                black 80%,
                transparent 100%
            ),
            radial-gradient(
                ellipse 70% 140% at center,
                black 55%,
                transparent 100%
            );
        mask-composite: intersect;
    }

    .slide {
        --slide-rotation: 0deg;

        position: absolute;
        top: var(--slideshow-shadow-top-space);
        bottom: var(--slideshow-controls-height);
        left: 50%;
        display: grid;
        width: min(65%, 58rem);
        place-items: center;
        padding-block: 1rem;
        opacity: 0.48;
        transform: translateX(calc(-50% + var(--slide-offset)))
            rotateY(var(--slide-rotation)) scale(var(--slide-scale));
        transition:
            transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1),
            opacity 320ms ease,
            filter 320ms ease;
        will-change: transform;
        backface-visibility: hidden;

        &.previous {
            --slide-rotation: -16deg;
        }

        &.next {
            --slide-rotation: 16deg;
        }

        &.active {
            z-index: 2;
            opacity: 1;
        }

        &.hidden {
            visibility: hidden;
            opacity: 0;
            pointer-events: none;
        }
    }

    .single {
        .slideshow-viewport {
            height: auto;
            overflow: visible;
            -webkit-mask-image: none;
            mask-image: none;
        }

        .slide {
            position: relative;
            inset: auto;
            left: 50%;
            width: min(92%, 64rem);
        }

        .image-trigger {
            height: auto;
        }

        .slide-image {
            width: auto;
            max-height: 70vh;
        }
    }

    .image-trigger {
        position: relative;
        display: flex;
        width: fit-content;
        height: fit-content;
        max-width: 100%;
        max-height: 100%;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: zoom-in;

        &:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: -2px;
        }
    }

    .slide-image {
        position: relative;
        z-index: 1;
        display: block;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: calc(var(--slideshow-height) - 2rem);
        margin: 0;
        border-radius: 0.65rem;
        object-fit: contain;
        box-shadow: 0 0.25rem 0.5rem rgb(0 0 0 / 35%);
        opacity: 1;
        transition:
            filter 160ms ease,
            box-shadow 320ms ease;
        user-select: none;
    }

    .slide.active .slide-image {
        box-shadow:
            0 0.65rem 1.5rem rgb(0 0 0 / 42%),
            0 1.5rem 3.5rem rgb(0 0 0 / 28%);
    }

    .slide:not(.active) .image-trigger {
        border-radius: 0.65rem;
    }

    .image-trigger:hover .slide-image {
        filter: brightness(1.08);
    }

    .slide:not(.active) .image-trigger {
        cursor: pointer;
    }

    .slideshow-control {
        display: grid;
        width: 3rem;
        height: 3rem;
        place-items: center;
        border-radius: 999px;
        color: #d4d4d4;
        background: color-mix(
            in srgb,
            rgba(20, 22, 28, 0.72),
            var(--accent) 10%
        );
        box-shadow: 0 0.4rem 1.5rem rgb(0 0 0 / 24%);
        font-size: 2.5rem;
        line-height: 1;
        cursor: pointer;
        transition:
            background-color 150ms ease,
            transform 150ms ease;

        .control-icon {
            display: block;
            width: 1rem;
            height: 1rem;
            line-height: 0;
        }

        &:hover {
            background: rgb(51 54 64 / 92%);
            transform: scale(1.05);
        }

        &:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 3px;
        }

        &:disabled {
            opacity: 0.22;
            cursor: default;
        }

        &:disabled:hover {
            background: rgb(20 22 28 / 72%);
            transform: none;
        }
    }

    .slideshow-controls {
        position: absolute;
        bottom: 0;
        left: 50%;
        z-index: 3;
        display: grid;
        width: min(32rem, calc(100% - 2rem));
        height: var(--slideshow-controls-height);
        grid-template-columns: 3rem minmax(0, 1fr) 3rem;
        align-items: center;
        gap: 1rem;
        transform: translateX(-50%);
    }

    .slideshow-pagination {
        display: flex;
        min-height: 1.5rem;
        align-items: center;
        justify-content: center;
        gap: 0.55rem;

        button {
            width: 0.55rem;
            height: 0.55rem;
            padding: 0;
            border: 0;
            border-radius: 999px;
            background: rgb(255 255 255 / 30%);
            cursor: pointer;
            transition:
                width 180ms ease,
                background-color 180ms ease;

            &.active {
                width: 1.5rem;
                background: var(--accent);
            }

            &:focus-visible {
                outline: 2px solid var(--accent);
                outline-offset: 3px;
            }
        }
    }

    .image-lightbox {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: grid;
        place-items: center;
        padding: 1rem;
        view-transition-name: slideshow-image-backdrop;
    }

    .image-lightbox-backdrop {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        cursor: zoom-out;
        background: rgb(7 9 13 / 92%);
        backdrop-filter: blur(12px);
    }

    .expanded-image-frame {
        position: relative;
        z-index: 1;
        display: block;
        width: fit-content;
        height: fit-content;
        max-width: calc(100vw - 2rem);
        max-height: calc(100dvh - 2rem);
        line-height: 0;

        img {
            display: block;
            width: auto;
            height: auto;
            max-width: calc(100vw - 2rem);
            max-height: calc(100dvh - 2rem);
            margin: 0;
            border-radius: 0.5rem;
            object-fit: contain;
            box-shadow: 0 1rem 4rem rgb(0 0 0 / 45%);
        }
    }

    .expanded-image-full {
        position: absolute;
        inset: 0;
        width: 100% !important;
        height: 100% !important;
        opacity: 0;
        transition: opacity 180ms ease-out;

        &.loaded {
            opacity: 1;
        }
    }

    .image-lightbox-status {
        position: fixed;
        top: max(1rem, env(safe-area-inset-top));
        left: max(1rem, env(safe-area-inset-left));
        z-index: 2;
        display: grid;
        width: 2.75rem;
        height: 2.75rem;
        place-items: center;
        border-radius: 999px;
        color: #d4d4d4;
        background: color-mix(
            in srgb,
            rgba(20, 22, 28, 0.72),
            var(--accent) 10%
        );
        box-shadow: 0 0.4rem 1.5rem rgb(0 0 0 / 24%);
        pointer-events: none;

        &.quality-unavailable {
            width: auto;
            padding-inline: 0.9rem;
            font-size: 0.75rem;
        }
    }

    .loading-spinner {
        width: 1.15rem;
        height: 1.15rem;
        border: 0.15rem solid rgb(212 212 212 / 32%);
        border-top-color: var(--accent);
        border-radius: 999px;
        animation: spin 700ms linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(1turn);
        }
    }

    .image-lightbox-close {
        position: fixed;
        top: max(1rem, env(safe-area-inset-top));
        right: max(1rem, env(safe-area-inset-right));
        z-index: 2;
        display: grid;
        width: 2.75rem;
        height: 2.75rem;
        place-items: center;
        border-radius: 999px;
        color: #d4d4d4;
        background: color-mix(
            in srgb,
            rgba(20, 22, 28, 0.72),
            var(--accent) 10%
        );
        font-size: 2rem;
        line-height: 1;
        cursor: pointer;
        transition:
            background-color 150ms ease,
            transform 150ms ease;

        &:hover {
            background: rgb(51 54 64 / 92%);
            transform: scale(1.05);
        }

        &:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 3px;
        }
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

    @media (max-width: 600px) {
        .slideshow {
            --slideshow-height: min(70vh, clamp(18rem, 95vw, 28rem));
            --slideshow-controls-height: 4rem;

            width: 100vw;
            margin: 1.75rem 0;
        }

        .slide {
            &.previous {
                --slide-rotation: -0deg;
            }

            &.next {
                --slide-rotation: 0deg;
            }
        }
        .slideshow-viewport {
            -webkit-mask-image: none;
            mask-image: none;
        }

        .single .slideshow-viewport {
            height: auto;
        }

        .slide {
            width: 84%;
        }

        .single .slide {
            width: calc(100% - 2rem);
        }

        .slideshow-control {
            width: 2.6rem;
            height: 2.6rem;
            font-size: 2.1rem;
        }

        .slideshow-controls {
            width: min(24rem, calc(100% - 1.5rem));
            grid-template-columns: 2.6rem minmax(0, 1fr) 2.6rem;
            gap: 0.75rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(::view-transition-group(slideshow-expanded-image)),
        :global(::view-transition-group(slideshow-image-backdrop)) {
            animation-duration: 1ms;
        }

        .slide,
        .slide-image,
        .slideshow-control,
        .slideshow-pagination button,
        .expanded-image-full,
        .image-lightbox-close {
            transition: none;
        }

        .loading-spinner {
            animation: none;
        }
    }
</style>
