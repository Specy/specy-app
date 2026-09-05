import { serverGetPosts } from '../blog/postsUtils';
import { SITE_URL } from '$lib/seo';

export const prerender = true;

/** Routes that exist as files rather than as data. `/404` is deliberately absent —
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

function urlEntry(path: string, lastmod?: string) {
    const loc = escapeXml(`${SITE_URL}${path}`);
    return `        <url>
            <loc>${loc}</loc>${lastmod ? `\n            <lastmod>${lastmod}</lastmod>` : ''}
        </url>`;
}

export const GET = async () => {
    const posts = await serverGetPosts();
    // Build date stands in for pages with no content date of their own. Posts carry a
    // real one, so their lastmod means something.
    const buildDate = new Date().toISOString().slice(0, 10);

    const entries = [
        ...STATIC_PATHS.map((path) => urlEntry(path, buildDate)),
        ...posts.map((post) =>
            urlEntry(
                post.url,
                new Date(post.datePublished).toISOString().slice(0, 10),
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
