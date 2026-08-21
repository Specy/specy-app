import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { SUPPORTED_EXTENSIONS } from '../src/lib/imagePreviews.js';

/**
 * Generates the preview files both for `vite dev` and production builds.
 *
 * @returns {import('vite').Plugin}
 */
export function markdownImagePreviews() {
    let projectRoot = process.cwd();
    let sourceDirectory = path.join(projectRoot, 'static/images');
    let outputDirectory = path.join(
        projectRoot,
        'static/generated/markdown-images',
    );

    const generateAll = async () => {
        const sources = await findImageFiles(sourceDirectory);
        const generated = await Promise.all(
            sources.map((source) =>
                generatePreview(source, sourceDirectory, outputDirectory),
            ),
        );
        return generated.filter(Boolean).length;
    };

    return {
        name: 'markdown-image-previews',
        enforce: 'pre',
        configResolved(config) {
            projectRoot = config.root;
            sourceDirectory = path.join(projectRoot, 'static/images');
            outputDirectory = path.join(
                projectRoot,
                'static/generated/markdown-images',
            );
        },
        async buildStart() {
            const count = await generateAll();
            this.info(
                count > 0
                    ? `Generated ${count} Markdown image previews`
                    : 'Markdown image previews are up to date',
            );
        },
        configureServer(server) {
            server.watcher.add(sourceDirectory);

            const updatePreview = async (file) => {
                if (!isSourceImage(file, sourceDirectory)) return;

                try {
                    const generated = await generatePreview(
                        file,
                        sourceDirectory,
                        outputDirectory,
                    );
                    if (generated) server.ws.send({ type: 'full-reload' });
                } catch (error) {
                    server.config.logger.error(
                        `Could not generate a Markdown image preview for ${file}: ${error}`,
                    );
                }
            };

            server.watcher.on('add', updatePreview);
            server.watcher.on('change', updatePreview);
        },
    };
}

/** @param {string} directory */
async function findImageFiles(directory) {
    /** @type {string[]} */
    const files = [];
    const entries = await readdir(directory, { withFileTypes: true });

    await Promise.all(
        entries.map(async (entry) => {
            const entryPath = path.join(directory, entry.name);
            if (entry.isDirectory()) {
                files.push(...(await findImageFiles(entryPath)));
            } else if (
                entry.isFile() &&
                SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
            ) {
                files.push(entryPath);
            }
        }),
    );

    return files;
}

/** @param {string} file @param {string} sourceDirectory */
function isSourceImage(file, sourceDirectory) {
    const relativePath = path.relative(sourceDirectory, file);
    return (
        relativePath !== '' &&
        !relativePath.startsWith('..') &&
        !path.isAbsolute(relativePath) &&
        SUPPORTED_EXTENSIONS.has(path.extname(file).toLowerCase())
    );
}

/**
 * @param {string} source
 * @param {string} sourceDirectory
 * @param {string} outputDirectory
 */
async function generatePreview(source, sourceDirectory, outputDirectory) {
    const relativePath = path.relative(sourceDirectory, source);
    const output = path.join(outputDirectory, `${relativePath}.webp`);

    try {
        const [sourceStats, outputStats] = await Promise.all([
            stat(source),
            stat(output),
        ]);
        if (outputStats.mtimeMs >= sourceStats.mtimeMs) return false;
    } catch {
        // A missing preview is the normal first-run case.
    }

    await mkdir(path.dirname(output), { recursive: true });
    await sharp(source)
        .rotate()
        .resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 72, effort: 4, smartSubsample: true })
        .toFile(output);
    return true;
}
