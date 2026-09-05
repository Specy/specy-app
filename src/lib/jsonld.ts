import { projects, desktopProjects, type ProjectData } from './Projects';
import { SITE_URL, toAbsoluteUrl, resolveShareImage } from './seo';
import type { PostMetadata } from './post';

/** Schema.org identity reused by every graph on the site, so the author of a post
 *  and the author of an app resolve to the same entity. */
const AUTHOR = {
    '@type': 'Person',
    name: 'Specy',
    url: SITE_URL,
    sameAs: ['https://github.com/Specy'],
} as const;

/**
 * `</script>` inside a JSON string would close the surrounding tag, and a lone `<!--`
 * starts an HTML comment. Escaping the three characters that can do that keeps the
 * payload valid JSON while making it inert as markup.
 */
export function serializeJsonLd(value: unknown) {
    return JSON.stringify(value)
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/&/g, '\\u0026');
}

/** A web app of mine, described so crawlers and answer engines can state what it is
 *  rather than infer it from the page copy. */
export function softwareApplicationLd(project: ProjectData) {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: project.title,
        description: project.description,
        url: project.url,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any (web browser)',
        offers: {
            '@type': 'Offer',
            price: 0,
            priceCurrency: 'USD',
        },
        author: AUTHOR,
        ...(project.github ? { sameAs: [project.github] } : {}),
    };
}

/** The hub page: who runs it, and the list of apps it links to. The ItemList is built
 *  from `Projects.ts` so a new project never has to be added in two places. */
export function homePageLd() {
    const listed = [...projects.filter((p) => !p.hidden), ...desktopProjects];
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                url: SITE_URL,
                name: 'Specy',
                publisher: { '@id': `${SITE_URL}/#person` },
            },
            { ...AUTHOR, '@id': `${SITE_URL}/#person` },
            {
                '@type': 'ItemList',
                name: 'Apps by Specy',
                itemListElement: listed.map((project, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: softwareApplicationLd(project),
                })),
            },
        ],
    };
}

/** A blog post. `datePublished` is the only date the frontmatter carries, so it stands
 *  in for `dateModified` too rather than inventing one. */
export function blogPostingLd(metadata: PostMetadata) {
    const url = toAbsoluteUrl(metadata.url);
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: metadata.title,
        description: metadata.description,
        datePublished: metadata.datePublished,
        dateModified: metadata.datePublished,
        image: resolveShareImage(metadata.image).url,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: AUTHOR,
        publisher: AUTHOR,
        ...(metadata.tags?.length ? { keywords: metadata.tags.join(', ') } : {}),
    };
}
