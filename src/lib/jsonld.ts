import {
    projects,
    desktopProjects,
    type ProjectData,
    type AppPageProject,
} from './Projects';
import { SITE_URL, toAbsoluteUrl, resolveShareImage } from './seo';
import type { PostMetadata } from './post';

export const PERSON_ID = `${SITE_URL}/#person`;
const ABOUT_URL = `${SITE_URL}/about`;

/** Schema.org identity reused by every graph on the site, so the author of a post
 *  and the author of an app resolve to the same entity. The `@id` makes the Person
 *  one node across separate JSON-LD blocks, and the other sites use the same one.
 *  Every `sameAs` profile was checked to belong to this person: the GitHub profile
 *  links the LinkedIn one, the npm user maintains the @specy packages, the crates.io
 *  user owns rooc and microlp. */
const AUTHOR = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Enrico Menichelli',
    alternateName: 'Specy',
    // The hub stays the Person's url, the same value every other site gives this
    // @id; /about is the page that describes the person
    url: SITE_URL,
    mainEntityOfPage: ABOUT_URL,
    sameAs: [
        'https://github.com/Specy',
        'https://www.linkedin.com/in/enrico-menichelli-5862a4211',
        'https://www.npmjs.com/~specy.dev',
        'https://crates.io/users/Specy',
        'https://portfolio.specy.app',
    ],
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
 *  rather than infer it from the page copy. A node meant for a graph that also holds
 *  the Person, so the author is a reference to it. The repository is what the app is
 *  built from, not another name for it, hence `isBasedOn` rather than `sameAs`: the
 *  two music apps share one. */
function softwareApplicationNode(project: ProjectData) {
    return {
        '@type': 'SoftwareApplication',
        name: project.title,
        description: project.details?.metaDescription ?? project.description,
        url: project.url,
        ...(project.category ? { applicationCategory: project.category } : {}),
        operatingSystem: project.operatingSystem ?? 'Any (web browser)',
        offers: {
            '@type': 'Offer',
            price: 0,
            priceCurrency: 'USD',
        },
        author: { '@id': PERSON_ID },
        ...(project.github ? { isBasedOn: project.github } : {}),
    };
}

/** An app's own page on the hub. The page is about the app, so the app is its main
 *  entity, with the features and screenshots the page shows. Each screenshot is the
 *  same preview image the page displays, with its caption or alt text. */
export function appPageLd(project: AppPageProject) {
    const { details } = project;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                ...softwareApplicationNode(project),
                mainEntityOfPage: toAbsoluteUrl(`/apps/${project.id}`),
                featureList: details.features.map((feature) => feature.title),
                screenshot: details.screenshots.map((screenshot) => ({
                    '@type': 'ImageObject',
                    url: resolveShareImage(screenshot.src).url,
                    caption: screenshot.caption ?? screenshot.alt,
                })),
            },
            AUTHOR,
        ],
    };
}

/** The About page describes the Person, so it is a ProfilePage with the Person as
 *  its main entity. */
export function aboutPageLd() {
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ProfilePage',
                '@id': ABOUT_URL,
                url: ABOUT_URL,
                name: 'About Specy',
                isPartOf: { '@id': `${SITE_URL}/#website` },
                mainEntity: { '@id': PERSON_ID },
            },
            AUTHOR,
        ],
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
                publisher: { '@id': PERSON_ID },
            },
            AUTHOR,
            {
                '@type': 'ItemList',
                name: 'Apps by Specy',
                itemListElement: listed.map((project, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: softwareApplicationNode(project),
                })),
            },
        ],
    };
}

/** A blog post. Most posts are never edited after publishing, so without a
 *  `dateModified` in the frontmatter `datePublished` stands in for it rather than
 *  inventing one. */
export function blogPostingLd(metadata: PostMetadata) {
    const url = toAbsoluteUrl(metadata.url);
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: metadata.title,
        description: metadata.description,
        datePublished: metadata.datePublished,
        dateModified: metadata.dateModified ?? metadata.datePublished,
        image: resolveShareImage(metadata.image).url,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        author: AUTHOR,
        publisher: AUTHOR,
        ...(metadata.tags?.length
            ? { keywords: metadata.tags.join(', ') }
            : {}),
    };
}
