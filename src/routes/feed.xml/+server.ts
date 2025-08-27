import { serverGetPosts } from "../blog/postsUtils";

export const prerender = true;

const SITE_URL = 'https://specy.app';
const SITE_TITLE = 'Specy\'s Blog';
const SITE_DESCRIPTION = 'Blog posts about programming, web development, and projects by Specy';

export const GET = async () => {
    const posts = await serverGetPosts();
    
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${SITE_TITLE}</title>
        <description>${SITE_DESCRIPTION}</description>
        <link>${SITE_URL}</link>
        <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <language>en-US</language>
        <generator>SvelteKit</generator>
        ${posts.map(post => `
        <item>
            <title><![CDATA[${post.title}]]></title>
            <description><![CDATA[${post.description}]]></description>
            <link>${SITE_URL}${post.url}</link>
            <guid isPermaLink="true">${SITE_URL}${post.url}</guid>
            <pubDate>${new Date(post.datePublished).toUTCString()}</pubDate>
            ${post.tags.map(tag => `<category>${tag}</category>`).join('\n            ')}
        </item>`).join('')}
    </channel>
</rss>`;

    return new Response(rssXml);
};
