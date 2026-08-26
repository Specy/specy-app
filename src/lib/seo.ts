import { resolveImagePreviewUrl } from './imagePreviews.js';

export const SITE_URL = 'https://specy.app';

/** Link preview image for pages that don't bring one of their own */
export const DEFAULT_SHARE_IMAGE = '/images/description.webp';

/** Crawlers ignore relative image URLs, so everything shared has to be absolute */
export function toAbsoluteUrl(url: string) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//')) return url;
    return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * The single image a page shares: its own when it has one, the site default
 * otherwise. Page images go through their generated preview so crawlers fetch
 * ~70KB instead of the multi megabyte original.
 */
export function resolveShareImage(image?: string | null) {
    const preview = resolveImagePreviewUrl(image);
    return {
        url: toAbsoluteUrl(preview ?? DEFAULT_SHARE_IMAGE),
        isOwnImage: preview !== null,
    };
}
