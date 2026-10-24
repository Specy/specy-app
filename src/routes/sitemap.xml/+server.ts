import { serverGetPosts } from '../blog/postsUtils';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** Routes that exist as files rather than as data. `/404` is deliberately absent:
 *  it is a real route in this app but has no business being in a sitemap. */
const STATIC_PATHS = ['/', '/blog', '/donate'];

/** The five characters that are not legal as-is in XML character data. URLs rarely
 *  contain them, but a slug with an `&` would otherwise produce an invalid document
 *  that search engines reject outright. */
function escapeXml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function toSitemapDate(date: string) {
    return new Date(date).toISOString().slice(0, 10);
}

function urlEntry(path: string, lastmod?: string) {
    const loc = escapeXml(`${SITE_URL}${path}`);
    return `        <url>
            <loc>${loc}</loc>${lastmod ? `\n            <lastmod>${lastmod}</lastmod>` : ''}
        </url>`;
}

export const GET = async () => {
    const posts = await serverGetPosts();
    // Only posts carry a date of their own. Every other page gets no lastmod at all:
    // stamping them with the build date would claim a change on every deploy, and
    // crawlers learn to ignore a lastmod that is always new.
    const entries = [
        ...STATIC_PATHS.map((path) => urlEntry(path)),
        ...posts.map((post) =>
            urlEntry(
                post.url,
                toSitemapDate(post.dateModified ?? post.datePublished),
            ),
        ),
    ];

    // changefreq and priority are deliberately omitted: Google ignores both, and a
    // stale hand-set priority is worse than none.
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

    return new Response(xml, {
        headers: { 'Content-Type': 'application/xml' },
    });
};
