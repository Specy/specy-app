import { axios } from './axios'
import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'
type Callbacks = {
    onSuccess?: (res:object) => void,
    onError?: (err: Error) => void,
}
type Config = {
    method: "POST" | "PATCH" | "DELETE"
    body?: {}
}
function useMutation(url: string, config: Config, callbacks: Callbacks = {}):
    [Writable<null | object>,Writable<null | object>,Writable<boolean>,(body: unknown) => void]
{

    const isLoading = writable(false)
    const data = writable(null)
    const error = writable(null)

    const mutate = (body) => {
        isLoading.set(true)
        axios.post(url, body, config)
            .then((res:object) => { data.set(res), callbacks.onSuccess && callbacks.onSuccess(res) })
            .catch((err:Error) => { error.set(err), callbacks.onError && callbacks.onError(err) })
            .finally(() => isLoading.set(false))
    }
    return [data, error, isLoading, mutate]
}


function useQuery(url: string, config: Config, callbacks: Callbacks = {}):
    [Writable<null | object>,Writable<null | object>,Writable<boolean>,(body: unknown) => void]
{
    const isLoading = writable(true)
    const data = writable(null)
    const error = writable(null)

    const query = () =>
        axios.get(url, config)
            .then((res:object) => { data.set(res), callbacks.onSuccess && callbacks.onSuccess(res) })
            .catch((err:Error) => { error.set(err), callbacks.onError && callbacks.onError(err) })
            .finally(() => isLoading.set(false))
    return [data, error, isLoading, query]
}

export {
    useQuery,
    useMutation
}