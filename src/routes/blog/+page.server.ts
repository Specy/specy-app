import {serverGetPosts} from "./postsUtils";


/** @type {import('./$types').PageLoad} */
export async function load({params}) {
    const res = await serverGetPosts();
    return {
        posts: res
    }
}