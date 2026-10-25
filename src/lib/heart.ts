// The heart of the tea cup easter egg, shared with the hearts that beat on hover
export type Segment = [number, number, number, number, number, number];

//Every shape is built from the same six cubic segments, walked clockwise from the top
//center, so any two of them can be interpolated point by point to morph between.

//the heart at rest
export const HEART_START: [number, number] = [50, 24];
export const HEART_SEGMENTS: Segment[] = [
    [53, 18, 60, 10, 70, 10],
    [80, 10, 92, 18, 92, 34],
    [92, 55, 68, 72, 50, 86],
    [32, 72, 8, 55, 8, 34],
    [8, 18, 20, 10, 30, 10],
    [40, 10, 47, 18, 50, 24],
];

//the same heart at the top of a beat: swollen and rounder, the lobes filling more
//than the apex, so a beat is an actual change of shape and not the whole icon zooming
export const SWOLLEN_START: [number, number] = [50, 21];
export const SWOLLEN_SEGMENTS: Segment[] = [
    [53, 14, 62, 6, 73, 6],
    [84, 6, 96, 14, 96, 33],
    [96, 56, 70, 74, 50, 89],
    [30, 74, 4, 56, 4, 33],
    [4, 14, 16, 6, 27, 6],
    [38, 6, 47, 14, 50, 21],
];

export const BEAT_MS = 820; //~73bpm

export const HEART_COLOR: [number, number, number] = [214, 48, 79];
export const FLUSH_COLOR: [number, number, number] = [240, 74, 104];

export function mix(from: number, to: number, t: number) {
    return from + (to - from) * t;
}

//a single muscle twitch: snaps into the beat, releases out of it more slowly
function twitch(u: number, rise: number, fall: number) {
    if (u <= 0 || u >= rise + fall) return 0;
    if (u < rise) {
        const x = u / rise;
        return x * x * (3 - 2 * x);
    }
    const x = (u - rise) / fall;
    return (1 - x) * (1 - x) * (1 + 2 * x);
}

//one cardiac cycle over u = 0..1: the "lub" that throws the heart wide open, the
//shorter, weaker "dub" behind it, then a long diastole where it settles back and
//recoils a little under its resting size before the next beat. The negative tail is
//what keeps it breathing rather than reading as a bouncing icon.
export function swellAt(u: number) {
    return (
        0.62 * twitch(u, 0.07, 0.2) +
        0.3 * twitch(u - 0.26, 0.05, 0.16) -
        0.14 * twitch(u - 0.46, 0.16, 0.3)
    );
}

//the heart's outline, swell expands it from rest towards the top of a beat
export function heartPath(swell: number) {
    const at = (relaxed: number, full: number) =>
        mix(relaxed, full, swell).toFixed(2);
    const parts = [
        `M${at(HEART_START[0], SWOLLEN_START[0])} ${at(HEART_START[1], SWOLLEN_START[1])}`,
    ];
    HEART_SEGMENTS.forEach((relaxed, i) => {
        const full = SWOLLEN_SEGMENTS[i];
        parts.push(`C${relaxed.map((v, j) => at(v, full[j])).join(' ')}`);
    });
    parts.push('Z');
    return parts.join(' ');
}

//the color of the heart, flushing brighter as it swells
export function heartColor(swell: number) {
    const flush = Math.max(0, swell) * 0.5;
    const [r, g, b] = HEART_COLOR.map((c, i) =>
        Math.round(mix(c, FLUSH_COLOR[i], flush)),
    );
    return `rgb(${r}, ${g}, ${b})`;
}
