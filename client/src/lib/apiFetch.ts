import { axios } from './axios'
import { writable } from 'svelte/store'
interface Callbacks{
    onSuccess?: Function,
    onError?: Function
}
const useMutation = (url: string, config,callbacks:Callbacks = {}) => {

    const isLoading = writable(false)
    const data = writable(null)
    const error = writable(null)

    const mutate = (body) => {
        isLoading.set(true)
        axios.post(url, body, config.axios)
            .then((res) => {data.set(res), callbacks.onSuccess && callbacks.onSuccess()})
            .catch((err) => {error.set(err), callbacks.onError && callbacks.onError()})
            .finally(() => isLoading.set(false))
    }
    return [data, error, isLoading, mutate]
}

interface Config {
    method: "POST" | "PATCH",
    data?: {},
}

const useQuery = (url: string, config,callbacks:Callbacks = {}) => {
    const isLoading = writable(true)
    const data = writable(null)
    const error = writable(null)

    const query = () =>
        axios.get(url, config.axios)
            .then((res) => {data.set(res), callbacks.onSuccess && callbacks.onSuccess()})
            .catch((err) => {error.set(err), callbacks.onError && callbacks.onError()})
            .finally(() => isLoading.set(false))
    return [data, error, isLoading, query]
}

export {
    useQuery,
    useMutation
}