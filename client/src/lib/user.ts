import { writable } from "svelte/store"
import { axios } from "./axios"
import type { Writable } from 'svelte/store'
import { BASEURL } from "./apiFetch"
function userStore(){
    const user = writable(null)

    async function fetchUser(){
        let res = null
        try{
            res = (await axios.get(BASEURL + "/auth/status"))
        }catch(e){
            console.log(e)
        }
        user.set(res)
    }
    fetchUser()
    console.log("fetch status")
    return { user, fetchUser}
}
export const User = userStore()