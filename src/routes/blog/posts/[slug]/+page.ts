import { type Post, type PostModule } from '$lib/post';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const { slug } = params;
    const res = await serverGetPost(slug);
    return {
        page: res.page,
        props: {
            metadata: res.metadata,
        },
        slug: res.metadata.slug,
    };
}

async function serverGetPost(name: string): Promise<Post> {
    const files = import.meta.glob<PostModule>('/src/posts/*.md', {
        eager: true,
    });
    const file = files[`/src/posts/${name}.md`];
    if (!file?.default) {
        throw error(404, 'Post not found');
    }
    const { default: page, metadata } = file;
    return {
        metadata: {
            ...metadata,
            url: `/blog/posts/${name}`,
            slug: name,
        },
        page,
    };
}
