import {type PostMetadata} from "$lib/post";

export async function serverGetPosts(): Promise<PostMetadata[]> {
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
    return posts.sort((a,b) => new Date(b.datePublished) - new Date(a.datePublished))
}