import { writable } from 'svelte/store'

export function Toast() {
    const title = writable("")
    const message = writable("")
    const duration = writable(3000)
    const lastEdit = writable(0)
    function execute(text: string, timeout: number) {
        message.set(text)
        duration.set(timeout)
        lastEdit.set(new Date().getTime())
    }
    function error(text: string, timeout = 3000) {
        title.set("Error")
        execute(text, timeout)
    }
    function log(text: string, timeout = 3000) {
        title.set("Error")
        execute(text, timeout)
    }
    function custom(textTitle: string, text: string, timeout = 3000) {
        title.set(textTitle)
        execute(text, timeout)
    }
    return {
        title, message, duration, error, log, custom, lastEdit
    }
}