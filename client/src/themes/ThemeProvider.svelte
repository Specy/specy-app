<script lang="ts">
	import { createDerivedThemeColors } from "./SvelteTheme"
	import { TinyColor } from "@ctrl/tinycolor"
	interface Props {
		style?: string;
		theme: any;
		children?: import('svelte').Snippet;
	}

	let { style = "", theme, children }: Props = $props();
	let colors = createDerivedThemeColors(theme)

	function toRgb(color: string) {
		return (new TinyColor(color)
			.toRgbString()
			.match(/(\s*\d+\s*),(\s*\d+\s*),(\s*\d+\s*)/) ?? [])[0]
	}
</script>

<div
	style={`
	display: flex; 
	flex-direction: column;

    ${$colors
			.map(({ cssProp, hex, text }) => {
				const rgb = toRgb(hex)
				const rgbText = toRgb(text ?? "#FFFFFF")
				return `
				--${cssProp}: ${hex};
				--${cssProp}-text: ${text};
				--RGB-${cssProp}: ${rgb};
				--RGB-${cssProp}-text: ${rgbText};
				`
			})

			.join("\n")}
    ${style}
`}
>
	{@render children?.()}
</div>
