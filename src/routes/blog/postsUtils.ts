import { type PostMetadata, type PostModule } from '$lib/post';

export async function serverGetPosts(): Promise<PostMetadata[]> {
    const paths = import.meta.glob<PostModule>('/src/posts/*.md', {
        eager: true,
    });
    const posts = await Promise.all(
        Object.entries(paths).map(async ([path, post]) => {
            const slug = path.split('/').pop()!.replace('.md', '');
            return {
                ...post.metadata,
                url: `/blog/posts/${slug}`,
                slug,
            };
        }),
    );
    return posts.sort(
        (a, b) =>
            new Date(b.datePublished).getTime() -
            new Date(a.datePublished).getTime(),
    );
}
