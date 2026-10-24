import { TinyColor, readability } from '@ctrl/tinycolor';

/** WCAG AA for normal sized text */
const MIN_CONTRAST = 4.5;
const LIGHT_TEXT = '#ffffff';
/** The site's background, the darkest text a filled button gets */
const DARK_TEXT = '#171a21';
/** Accent colored text sits on the page and on its cards. This is a little lighter
 *  than both, so a color that reads here reads everywhere on the page. */
const DARK_SURFACE = '#232833';

export type AccentPalette = {
    /** The app's own color, for glows, tints, borders and lines */
    color: string;
    /** Behind the text of filled buttons */
    fill: string;
    /** The text on `fill` */
    onFill: string;
    /** Text and icons in the accent, on the dark page */
    text: string;
};

function readableText(background: TinyColor) {
    const light = readability(background, LIGHT_TEXT);
    const dark = readability(background, DARK_TEXT);
    return light >= dark
        ? { color: LIGHT_TEXT, contrast: light }
        : { color: DARK_TEXT, contrast: dark };
}

/**
 * Derives the shades an app page needs from the app's brand color, so every app
 * states one color and still gets readable text. A mid tone can be too light for
 * white text and too dark for dark text, so the button fill darkens until one of
 * the two meets AA, and the text shade moves away from `surface` (lighter on a dark
 * theme, darker on a light one) until it reads on the cards. Colors that already
 * pass are left as they are.
 */
export function accentPalette(
    color: string,
    surface: string = DARK_SURFACE,
): AccentPalette {
    let fill = new TinyColor(color);
    while (readableText(fill).contrast < MIN_CONTRAST) fill = fill.darken(1);
    const darkSurface = new TinyColor(surface).isDark();
    let text = new TinyColor(color);
    for (
        let step = 0;
        step < 100 && readability(text, surface) < MIN_CONTRAST;
        step++
    ) {
        text = darkSurface ? text.lighten(1) : text.darken(1);
    }
    return {
        color,
        fill: fill.toHexString(),
        onFill: readableText(fill).color,
        text: text.toHexString(),
    };
}

/** The palette as the custom properties the app page and its cards read */
export function accentStyle(color: string, surface?: string) {
    const palette = accentPalette(color, surface);
    return [
        `--app-color: ${palette.color}`,
        `--app-color-fill: ${palette.fill}`,
        `--app-color-on-fill: ${palette.onFill}`,
        `--app-color-text: ${palette.text}`,
    ].join('; ');
}

type ThemeColor = { cssProp: string; hex: string; text?: string };

/**
 * How much of the app's color goes into each surface, in percent. Enough to make
 * the page plainly that app's, little enough that text keeps its contrast: darker
 * surfaces take more, since a little color barely shows on them.
 */
const SURFACE_TINT: Record<string, { dark: number; light: number }> = {
    background: { dark: 9, light: 6 },
    primary: { dark: 9, light: 6 },
    secondary: { dark: 12, light: 8 },
    tertiary: { dark: 16, light: 10 },
    footer: { dark: 10, light: 6 },
};

/** The theme's card surface, which accent colored text has to read on */
export function themeSurface(colors: ThemeColor[]) {
    return colors.find((c) => c.cssProp === 'secondary')?.hex ?? DARK_SURFACE;
}

/**
 * The active theme recolored for one app: the accent becomes the app's (as a
 * shade that reads on this theme's cards) and the background, cards and footer
 * take a share of it, so the whole page, chrome included, wears the app's color
 * in the light and the dark theme alike. Text colors of the surfaces are kept.
 */
export function tintTheme<T extends ThemeColor>(
    colors: T[],
    color: string,
): T[] {
    const { text } = accentPalette(color, themeSurface(colors));
    return colors.map((entry) => {
        if (entry.cssProp === 'accent') {
            return {
                ...entry,
                hex: text,
                text: readableText(new TinyColor(text)).color,
            };
        }
        const tint = SURFACE_TINT[entry.cssProp];
        if (!tint) return entry;
        const base = new TinyColor(entry.hex);
        const amount = base.isDark() ? tint.dark : tint.light;
        return { ...entry, hex: base.mix(color, amount).toHexString() };
    });
}
