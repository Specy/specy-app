import { axios } from './axios'
import { writable } from 'svelte/store'
type Callbacks = {
    onSuccess?: Function,
    onError?: Function
}
type Config = {
    method: "POST" | "PATCH" | "DELETE"
    body?: {}
}
function useMutation(url: string, config: Config, callbacks: Callbacks = {}) {

    const isLoading = writable(false)
    const data = writable(null)
    const error = writable(null)

    const mutate = (body) => {
        isLoading.set(true)
        axios.post(url, body, config)
            .then((res) => { data.set(res), callbacks.onSuccess && callbacks.onSuccess(res) })
            .catch((err) => { error.set(err), callbacks.onError && callbacks.onError(err) })
            .finally(() => isLoading.set(false))
    }
    return [data, error, isLoading, mutate]
}


function useQuery(url: string, config: Config, callbacks: Callbacks = {}) {
    const isLoading = writable(true)
    const data = writable(null)
    const error = writable(null)

    const query = () =>
        axios.get(url, config)
            .then((res) => { data.set(res), callbacks.onSuccess && callbacks.onSuccess() })
            .catch((err) => { error.set(err), callbacks.onError && callbacks.onError() })
            .finally(() => isLoading.set(false))
    return [data, error, isLoading, query]
}

export {
    useQuery,
    useMutation
}