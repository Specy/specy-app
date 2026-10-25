<script lang="ts">
    import { createDerivedThemeColors } from './SvelteTheme';
    import { TinyColor } from '@ctrl/tinycolor';
    import { accentStyle, themeSurface, tintTheme } from '$lib/appAccent';
    interface Props {
        style?: string;
        theme: any;
        /** An app's color, set while one of the app pages is open: the theme is
         *  recolored for it and the page gets its --app-color properties */
        accent?: string;
        children?: import('svelte').Snippet;
    }

    let { style = '', theme, accent, children }: Props = $props();
    let colors = $derived(createDerivedThemeColors(theme));

    function toRgb(color: string) {
        return (new TinyColor(color)
            .toRgbString()
            .match(/(\s*\d+\s*),(\s*\d+\s*),(\s*\d+\s*)/) ?? [])[0];
    }
</script>

<div
    style={`
	display: flex; 
	flex-direction: column;

    ${(accent ? tintTheme($colors, accent) : $colors)
        .map(({ cssProp, hex, text }) => {
            const rgb = toRgb(hex);
            const rgbText = toRgb(text ?? '#FFFFFF');
            return `
				--${cssProp}: ${hex};
				--${cssProp}-text: ${text};
				--RGB-${cssProp}: ${rgb};
				--RGB-${cssProp}-text: ${rgbText};
				`;
        })

        .join('\n')}
    ${accent ? accentStyle(accent, themeSurface($colors)) : ''};
    ${style}
`}
>
    {@render children?.()}
</div>
