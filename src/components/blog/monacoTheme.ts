import { TinyColor } from '@ctrl/tinycolor'
import type monaco from 'monaco-editor'
import { currentTheme } from '../../stores/themeStore'
export function generateTheme(): monaco.editor.IStandaloneThemeData {
    const base = currentTheme.getColor('secondary')
    return {
        base: 'vs-dark',    
        inherit: true,
        rules: darkOverride,
        colors: {
            'editor.foreground': currentTheme.getText('secondary')!, //CDCDCD
            'editor.background': '#52537a0f',
            'editor.selectionBackground': currentTheme.layer('tertiary', 2)!.toHexString(),
            'editor.lineHighlightBackground': currentTheme.layer('secondary', 5)!.toHexString(),
            'editorCursor.foreground': currentTheme.getColor('accent')!.toHexString(),
            'editorWhitespace.foreground':
                new TinyColor(currentTheme.getText('secondary')!).toHexString() + '2A',
            'editorWidget.background': currentTheme.getColor('tertiary')!.toHexString(),
            'editorSuggestWidget.selectedBackground': currentTheme.getColor('accent2')!
                .darken(5)
                .toHexString(),
            'input.background': currentTheme.layer('tertiary', 10)!.toHexString()
        }
    }
}

const common = [
    {
        fontStyle: 'underline',
        token: 'label'
    }
]
const darkOverride = [
    ...common,
]