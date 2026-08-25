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
