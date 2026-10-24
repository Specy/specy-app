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
 * the two meets AA, and a dark brand color lightens until it reads as text on the
 * dark page. Colors that already pass are left as they are.
 */
export function accentPalette(color: string): AccentPalette {
    let fill = new TinyColor(color);
    while (readableText(fill).contrast < MIN_CONTRAST) fill = fill.darken(1);
    let text = new TinyColor(color);
    while (readability(text, DARK_SURFACE) < MIN_CONTRAST) {
        text = text.lighten(1);
    }
    return {
        color,
        fill: fill.toHexString(),
        onFill: readableText(fill).color,
        text: text.toHexString(),
    };
}

/** The palette as the custom properties the app page and its cards read */
export function accentStyle(color: string) {
    const palette = accentPalette(color);
    return [
        `--app-color: ${palette.color}`,
        `--app-color-fill: ${palette.fill}`,
        `--app-color-on-fill: ${palette.onFill}`,
        `--app-color-text: ${palette.text}`,
    ].join('; ');
}
