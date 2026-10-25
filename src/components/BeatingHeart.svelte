<script lang="ts">
    //The tea cup's heart, beating for as long as `beating` is on
    import { BEAT_MS, heartColor, heartPath, swellAt } from '$lib/heart';

    interface Props {
        beating?: boolean;
    }

    let { beating = false }: Props = $props();

    let swell = $state(0);
    let frame = 0;

    $effect(() => {
        if (!beating || frame) return;
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const start = performance.now();
        let beat = 0;
        function step(now: number) {
            const elapsed = (now - start) / BEAT_MS;
            //a beat that started always finishes, so letting go never snaps it back
            if (elapsed >= beat + 1) {
                beat = Math.floor(elapsed);
                if (!beating) {
                    swell = 0;
                    frame = 0;
                    return;
                }
            }
            swell = swellAt(elapsed - beat);
            frame = requestAnimationFrame(step);
        }
        frame = requestAnimationFrame(step);
    });

    $effect(() => () => cancelAnimationFrame(frame));
</script>

<svg
    viewBox="0 0 100 100"
    aria-hidden="true"
    style="transform: scale({1 + 0.07 * swell}) rotate({2.2 * swell}deg)"
>
    <path d={heartPath(swell)} fill={heartColor(swell)} />
</svg>

<style lang="scss">
    svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
    }
</style>
