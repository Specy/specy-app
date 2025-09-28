<script lang="ts">
	import Monaco from "$cmp/blog/Monaco.svelte"

	const { language, code, style, height } = $props<{
		language: "typescript" | "string"
		code: string
		style?: string
        height?: string
	}>()
</script>

<Monaco 
    {language} 
    code={code.trim()}
    style={`margin: 1rem 0; ${style ?? ''} ${height ? `height: ${height};` : 'height: auto;'}`}
/>