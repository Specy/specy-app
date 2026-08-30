export type PostMetadata = {
    datePublished: string;
    title: string;
    description: string;
    tags: string[];
    relatedProjects: string[];
    /** Optional full resolution image used for link previews and page backgrounds */
    image?: string;
    slug: string;
    url: string;
};
export type Post = {
    metadata: PostMetadata;
    page: () => any;
};
/** A post `.md` as loaded by `import.meta.glob`. `slug` and `url` are derived from
 *  the file path, so they are never present in the frontmatter itself. */
export type PostModule = {
    default: Post['page'];
    metadata: Omit<PostMetadata, 'slug' | 'url'>;
};
