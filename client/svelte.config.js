import {mdsvex} from "mdsvex";
import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';
import path from 'path';
import remarkGithub from "remark-github";
import remarkContainer from "remark-containers";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

/** @type {import('@sveltejs/kit').Config} */
const config = {

    preprocess: [vitePreprocess(), mdsvex({
        extensions: ['.svx', '.mdx', '.md'],
        remarkPlugins: [
            [remarkGithub, {repository: 'specy/specy-app'}],
            remarkContainer,
        ],
        rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, {behavior: 'wrap'}],
        ],
/*
        highlight: {
            highlighter: (code, lang = "") => {

            }
        },
 */
        layout: {
            _: path.resolve('./src/components/layouts/BlogLayout.svelte'),
        }
    })],

    kit: {
        adapter: adapter({
            fallback: '404.html'
        })
    },

    extensions: [".svelte", ".svx", ".md", ".mdx"],
};
export default config;
