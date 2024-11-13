import {type PostMetadata} from "$lib/post";

/** @type {import('./$types').PageLoad} */
export async function load({params}) {
    const res = await serverGetPosts();
    return {
        posts: res
    }
}


async function serverGetPosts(): Promise<PostMetadata[]> {
    const paths = import.meta.glob('/src/posts/*.md', {eager: true})
    const posts = await Promise.all(
        Object.entries(paths).map(async ([path, post]) => {
            return {
                url: `/blog/posts/${path.split('/').pop().replace('.md', '')}`,
                slug: path.split('/').pop().replace('.md', ''),
                ...post.metadata ?? {},
            }

        })
    )
    return posts
}