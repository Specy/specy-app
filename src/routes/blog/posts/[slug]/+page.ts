import {type Post} from "$lib/post";
import {error} from "@sveltejs/kit";

/** @type {import('./$types').PageLoad} */
export async function load({params}) {
    const {slug} = params;
    const res =  await serverGetPost(slug);
    return {
        page: res.page,
        props: {
            metadata: res.metadata
        },
        slug: res.metadata.slug
    }
}

async function serverGetPost(name: string): Promise<Post> {
    const files = import.meta.glob('/src/posts/*.md', {eager: true})
    const file = files[`/src/posts/${name}.md`]
    const {default: page, metadata} = file
    if (!page) {
        throw error(404, 'Post not found')
    }
    return {
        metadata: {
            url: `/blog/posts/${name}`,
            slug: name,
            ...(metadata ?? {}),
        },
        page,
    };
}