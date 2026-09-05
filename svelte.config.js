import { mdsvex } from 'mdsvex';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';
import path from 'path';
import remarkGithub from 'remark-github';
import remarkContainer from 'remark-containers';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import { fileURLToPath } from 'url';
import rehypeExternalLinks from 'rehype-external-links';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Posts write their body headings as `#`, which is ergonomic in markdown but leaves
 * every post with a fistful of <h1>s alongside the one BlogLayout renders for the
 * title. Shifting each heading down a level at build time keeps the markdown as it is
 * and still gives the page a single <h1> with a real hierarchy underneath it.
 */
function rehypeDemoteHeadings() {
    return (tree) => {
        const walk = (node) => {
            if (node.type === 'element') {
                const level = /^h([1-5])$/.exec(node.tagName);
                if (level) node.tagName = `h${Number(level[1]) + 1}`;
            }
            node.children?.forEach(walk);
        };
        walk(tree);
    };
}

const path_to_layout = path.join(
    __dirname,
    './src/components/layouts/BlogLayout.svelte',
);

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        vitePreprocess(),
        mdsvex({
            extensions: ['.svx', '.mdx', '.md'],
            remarkPlugins: [
                [remarkGithub, { repository: 'specy/specy-app' }],
                [
                    remarkContainer,
                    {
                        default: true,
                        custom: [
                            {
                                type: 'sidetrack',
                                element: 'details',
                                transform(node) {
                                    node.data.hProperties = {
                                        className: 'sidetrack',
                                    };
                                    node.children.unshift({
                                        type: 'paragraph',
                                        data: {
                                            hName: 'summary',
                                            hProperties: {
                                                className: 'sidetrack-title',
                                            },
                                        },
                                        children: [
                                            {
                                                type: 'text',
                                                value: 'Sidetrack',
                                            },
                                        ],
                                    });
                                },
                            },
                        ],
                    },
                ],
            ],
            rehypePlugins: [
                // before rehypeSlug so the ids land on the final heading elements
                rehypeDemoteHeadings,
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                rehypeExternalLinks,
                {
                    target: '_blank',
                    rel: ['noopener', 'noreferrer'],
                },
            ],
            layout: {
                _: path_to_layout,
            },
        }),
    ],

    kit: {
        adapter: adapter({
            fallback: '404.html',
        }),
        //declared here rather than in vite.config.ts so that they reach both Vite and the
        //tsconfig SvelteKit generates, otherwise svelte-check cannot resolve them
        alias: {
            $cmp: 'src/components',
            $src: 'src',
            $stores: 'src/stores',
            $utils: 'src/utils',
        },
    },

    extensions: ['.svelte', '.svx', '.md', '.mdx'],
};
export default config;
