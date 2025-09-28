import { browser } from '$app/environment'
import { generateTheme } from './monacoTheme'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import type monaco from 'monaco-editor'

export type MonacoType = typeof monaco

class MonacoLoader {
    private monaco!: MonacoType
    private loading!: Promise<MonacoType>
    toDispose: monaco.IDisposable[] = []

    constructor() {
        if (browser) this.load()
    }

    dispose = () => {
        this.toDispose.forEach((d) => d.dispose())
    }

    async load(): Promise<MonacoType> {
        if (this.loading) return this.loading
        this.loading = import('monaco-editor')
        const monaco: MonacoType = await this.loading
        monaco.editor.defineTheme('custom-theme', generateTheme())
        this.monaco = monaco
        // @ts-ignore add worker
        self.MonacoEnvironment = {
            getWorker: async function (_: unknown, label: string) {
                if (label === 'typescript' || label === 'javascript') {
                    const worker = await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker')
                    return new worker.default()
                }
                const worker = await import('monaco-editor/esm/vs/editor/editor.worker?worker')
                return new worker.default()
            }
        }
        return monaco
    }

    setTheme = (theme: string) => {
        this.monaco.editor.setTheme(theme)
    }
    setCustomTheme = (theme: monaco.editor.IStandaloneThemeData) => {
        this.monaco.editor.defineTheme('custom-theme', theme)
        this.monaco.editor.setTheme('custom-theme')
    }

    async get() {
        if (this.monaco) return this.monaco
        await this.load()
        return this.monaco
    }
}

export const Monaco = new MonacoLoader()