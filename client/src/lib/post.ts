
export type PostMetadata = {
    createdAt: string
    title: string
    description: string
    tags: string[]
    relatedProjects: string[]
    slug: string,
    url: string
}
export type Post = {
    metadata: PostMetadata,
    page: () => any
}




