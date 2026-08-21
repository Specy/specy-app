const SOURCE_URL_PREFIX = '/images/';
const PREVIEW_URL_PREFIX = '/generated/markdown-images/';
const SUPPORTED_EXTENSIONS = new Set([
    '.avif',
    '.jpeg',
    '.jpg',
    '.png',
    '.tif',
    '.tiff',
    '.webp',
]);

/**
 * Turns a public, full-resolution image URL into its generated preview URL.
 * Keeping this mapping in one place ensures the UI and Vite always agree.
 *
 * @param {string} source
 */
export function getImagePreviewUrl(source) {
    const pathname = source.split(/[?#]/, 1)[0];
    const extensionStart = pathname.lastIndexOf('.');
    const extension =
        extensionStart === -1
            ? ''
            : pathname.slice(extensionStart).toLowerCase();

    if (
        !pathname.startsWith(SOURCE_URL_PREFIX) ||
        !SUPPORTED_EXTENSIONS.has(extension)
    ) {
        return null;
    }

    const relativePath = pathname.slice(SOURCE_URL_PREFIX.length);
    if (
        !relativePath ||
        relativePath.split('/').some((segment) => segment === '..')
    ) {
        return null;
    }

    return `${PREVIEW_URL_PREFIX}${relativePath}.webp`;
}

export { SUPPORTED_EXTENSIONS };
