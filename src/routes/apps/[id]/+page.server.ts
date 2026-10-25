import { error } from '@sveltejs/kit';
import { appPageProjects } from '$lib/Projects';
import { serverGetPosts } from '../../blog/postsUtils';
import type { EntryGenerator, PageServerLoad } from './$types';

/** One page per app that has details, so the list lives in `Projects.ts` only */
export const entries: EntryGenerator = () =>
    appPageProjects.map((project) => ({ id: project.id }));

export const load: PageServerLoad = async ({ params }) => {
    const project = appPageProjects.find((p) => p.id === params.id);
    if (!project) throw error(404, 'App not found');
    // Posts name the apps they are about in their frontmatter, so the page picks
    // them up without a second list to keep in sync.
    const posts = await serverGetPosts();
    return {
        project,
        relatedPosts: posts.filter((post) =>
            post.relatedProjects?.includes(project.id),
        ),
    };
};
