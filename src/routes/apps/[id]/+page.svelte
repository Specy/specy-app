<script lang="ts">
    import Seo from '$cmp/Seo.svelte';
    import PostCard from '$cmp/PostCard.svelte';
    import AppLinkCard from '$cmp/AppLinkCard.svelte';
    import ScreenshotGallery from '$cmp/ScreenshotGallery.svelte';
    import { appPageProjects } from '$lib/Projects';
    import { appPageLd } from '$lib/jsonld';
    import MdOpenInNew from '~icons/mdi/open-in-new';
    import MdBookOpenVariant from '~icons/mdi/book-open-variant';
    import FaGithub from '~icons/fa-brands/github';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let project = $derived(data.project);
    let details = $derived(project.details);
    let host = $derived(new URL(project.url).host);
    let repository = $derived(
        project.github.replace(/^https:\/\/github\.com\//, ''),
    );
    let otherApps = $derived(
        appPageProjects.filter((other) => other.id !== project.id),
    );
</script>

<Seo
    title={details.metaTitle}
    description={details.metaDescription}
    image={details.screenshots[0].src}
    jsonLd={appPageLd(project)}
/>

<div class="app-page">
    <header class="hero">
        <div class="hero-text">
            <nav class="breadcrumb" aria-label="Breadcrumb">
                <a href="/#web-apps">Apps</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{project.title}</span>
            </nav>
            <img
                class="hero-icon"
                src={project.image}
                alt=""
                width="80"
                height="80"
            />
            <h1 class="hero-title">{project.title}</h1>
            <p class="hero-tagline">{details.tagline}</p>
            <div class="hero-actions">
                <a
                    class="open-btn"
                    href={project.url}
                    target="_blank"
                    rel="noopener"
                >
                    Open {project.title}
                    <span class="btn-icon"><MdOpenInNew /></span>
                </a>
                {#if project.github}
                    <a
                        class="secondary-btn"
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span class="btn-icon"><FaGithub /></span>
                        Source code
                    </a>
                {/if}
            </div>
        </div>
        <div class="hero-shot">
            <ScreenshotGallery
                screenshots={details.screenshots}
                {host}
                label="Screenshots of {project.title}"
            />
        </div>
    </header>

    <section class="intro">
        <div class="about">
            <h2 class="section-title">About {project.title}</h2>
            {#each details.about as paragraph}
                <p>{paragraph}</p>
            {/each}
        </div>
        <aside class="audience">
            <h2 class="section-title">Who it's for</h2>
            <ul>
                {#each details.audience as item}
                    <li>{item}</li>
                {/each}
            </ul>
        </aside>
    </section>

    <section>
        <h2 class="section-title">Features</h2>
        <div class="features">
            {#each details.features as feature, i (feature.title)}
                <div class="feature" style="--index: {i}">
                    <h3 class="feature-title">{feature.title}</h3>
                    <p class="feature-description">{feature.description}</p>
                </div>
            {/each}
        </div>
    </section>

    {#if data.relatedPosts.length > 0}
        <section>
            <h2 class="section-title">From the blog</h2>
            <div class="posts">
                {#each data.relatedPosts as post (post.slug)}
                    <PostCard {post} titleLevel="h3" compact />
                {/each}
            </div>
        </section>
    {/if}

    <section class="links-card">
        <div class="links-text">
            <h2 class="section-title">Source code and links</h2>
            <ul class="links-list">
                {#if project.github}
                    <li>
                        <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span class="link-icon"><FaGithub /></span>
                            <span>
                                <span class="link-label">Source code</span>
                                <span class="link-detail">{repository}</span>
                            </span>
                            <span class="link-external"><MdOpenInNew /></span>
                        </a>
                    </li>
                {/if}
                {#each details.links ?? [] as link (link.url)}
                    <li>
                        <a href={link.url} target="_blank" rel="noreferrer">
                            <span class="link-icon"><MdBookOpenVariant /></span>
                            <span>
                                <span class="link-label">{link.label}</span>
                                <span class="link-detail"
                                    >{new URL(link.url).host}</span
                                >
                            </span>
                            <span class="link-external"><MdOpenInNew /></span>
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="links-cta">
            <img
                class="links-cta-icon"
                src={project.image}
                alt=""
                width="64"
                height="64"
                loading="lazy"
            />
            <a
                class="open-btn"
                href={project.url}
                target="_blank"
                rel="noopener"
            >
                Open {project.title}
                <span class="btn-icon"><MdOpenInNew /></span>
            </a>
            <span class="links-cta-host">{host}</span>
        </div>
    </section>

    {#if details.disclaimer}
        <p class="disclaimer">{details.disclaimer}</p>
    {/if}

    <section>
        <h2 class="section-title">Other apps</h2>
        <div class="other-apps">
            {#each otherApps as other, i (other.id)}
                <AppLinkCard project={other} index={i} />
            {/each}
        </div>
    </section>
</div>

<style lang="scss">
    /* The root layout's ThemeProvider recolors the whole site for the open app (see
       `tintTheme`) and sets the `accentStyle` properties used here: --app-color for
       glows, tints and lines, --app-color-fill and --app-color-on-fill for buttons,
       --app-color-text for text and icons. --accent is already the app's, so shared
       components like the post cards follow without help. */
    .app-page {
        --glow: color-mix(in srgb, var(--app-color) 55%, transparent);
        /* Translucent cards, read by this page's cards and by the post and app
           cards it shows */
        --card-background: rgb(255 255 255 / 4%);
        --card-background-hover: rgb(255 255 255 / 7%);
        --card-border: color-mix(in srgb, var(--app-color) 22%, transparent);
        position: relative;
        isolation: isolate;
        width: 100%;
        max-width: 72rem;
        margin: 0 auto;
        padding: 1rem 2rem 6rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 4.5rem;
    }

    /* The app's color washing over the top of the page, behind the hero. The
       gradients stop at the closest side so neither is cut off by the box. */
    .app-page::before {
        content: '';
        position: absolute;
        inset: 0 0 auto 0;
        height: 52rem;
        z-index: -1;
        pointer-events: none;
        background:
            radial-gradient(
                closest-side at 70% 42%,
                color-mix(in srgb, var(--app-color) 30%, transparent),
                transparent
            ),
            radial-gradient(
                closest-side at 22% 30%,
                color-mix(in srgb, var(--app-color) 16%, transparent),
                transparent
            );
    }

    .app-page ::selection {
        background-color: color-mix(in srgb, var(--app-color) 45%, transparent);
    }

    /* The blog's heading font */
    .hero-title,
    .section-title,
    .feature-title {
        font-family: var(--heading-font), Rubik, sans-serif;
    }

    .breadcrumb {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.95rem;
        color: #9a9aab;
        margin-bottom: 1.4rem;
        > a {
            transition: color 0.2s;
        }
        > a:hover,
        > a:focus-visible {
            color: var(--app-color-text);
        }
        > [aria-current] {
            color: #dbdbdb;
        }
    }

    /* ---------------------------------------------------------------- hero -- */
    .hero {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        align-items: center;
        gap: 3rem;
        margin-top: 1rem;
    }

    .hero-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        > * {
            animation: rise 0.6s backwards cubic-bezier(0.2, 0.7, 0.46, 1);
        }
        > :nth-child(2) {
            animation-delay: 80ms;
        }
        > :nth-child(3) {
            animation-delay: 160ms;
        }
        > :nth-child(4) {
            animation-delay: 240ms;
        }
        > :nth-child(5) {
            animation-delay: 320ms;
        }
    }

    .hero-icon {
        width: 5rem;
        height: 5rem;
        border-radius: var(--radius-icon);
        box-shadow: 0 0 0 1px rgb(255 255 255 / 8%);
    }

    .hero-title {
        margin-top: 1.4rem;
        font-size: 3.6rem;
        font-weight: bold;
        line-height: 1.05;
        letter-spacing: -0.01em;
        text-shadow: 1px 1px 4px rgba(var(--RGB-shadow-color), 0.25);
    }

    .hero-tagline {
        margin-top: 1rem;
        font-size: 1.3rem;
        line-height: 1.5;
        color: #dbdbdb;
        max-width: 32rem;
    }

    .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        margin-top: 2rem;
    }

    .btn-icon {
        display: flex;
        width: 1.1rem;
        flex-shrink: 0;
    }

    .open-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        padding: 0.85rem 1.4rem;
        border-radius: var(--radius-xl);
        background-color: var(--app-color-fill);
        color: var(--app-color-on-fill);
        font-size: 1.1rem;
        box-shadow:
            0 0.8rem 2rem -0.8rem var(--glow),
            inset 0 1px 0 rgb(255 255 255 / 18%);
        transition: all 0.2s;
    }
    /* Lifts and glows rather than brightening, which would change the contrast the
       fill and its text were picked for */
    .open-btn:hover,
    .open-btn:focus-visible {
        transform: translateY(-0.1rem);
        box-shadow:
            0 1rem 2.6rem -0.5rem var(--glow),
            inset 0 1px 0 rgb(255 255 255 / 18%);
    }

    .secondary-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.85rem 1.2rem;
        border-radius: var(--radius-xl);
        background-color: rgb(255 255 255 / 8%);
        color: #dbdbdb;
        font-size: 1.1rem;
        transition: all 0.2s;
    }
    .secondary-btn:hover,
    .secondary-btn:focus-visible {
        background-color: color-mix(
            in srgb,
            var(--app-color) 22%,
            rgb(255 255 255 / 10%)
        );
        color: white;
    }

    .open-btn:focus-visible,
    .secondary-btn:focus-visible,
    .links-list a:focus-visible,
    .breadcrumb > a:focus-visible {
        outline: 2px solid var(--app-color-text);
        outline-offset: 2px;
    }

    .hero-shot {
        position: relative;
        animation: shot-in 0.9s backwards cubic-bezier(0.2, 0.7, 0.46, 1) 150ms;
    }

    /* The app's color glowing from behind the screenshot */
    .hero-shot::before {
        content: '';
        position: absolute;
        inset: 8% 4% -4% 10%;
        background: radial-gradient(closest-side, var(--glow), transparent);
        filter: blur(2.5rem);
        z-index: -1;
    }

    /* ------------------------------------------------------------ sections -- */
    .section-title {
        font-size: 2rem;
        font-weight: var(--heading-weight);
        line-height: 1.2;
        margin-bottom: 1.4rem;
    }

    .intro {
        display: grid;
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
        gap: 2.5rem;
        align-items: start;
    }

    .about > p {
        font-size: 1.15rem;
        line-height: 1.65;
        color: #dbdbdb;
        & + p {
            margin-top: 1rem;
        }
    }

    .audience {
        padding: 1.4rem 1.5rem;
        border-radius: var(--radius-2xl);
        background-color: var(--card-background);
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        border: solid 1px var(--card-border);
        > ul {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
        }
        li {
            font-size: 1.05rem;
            line-height: 1.45;
            color: #dbdbdb;
        }
    }

    .features {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
    }
    .feature {
        padding: 1.2rem 1.3rem 1.3rem 1.3rem;
        border-radius: var(--radius-2xl);
        background-color: var(--card-background);
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        border: solid 1px var(--card-border);
        animation: rise 0.5s backwards cubic-bezier(0.2, 0.7, 0.46, 1);
        animation-delay: calc(var(--index) * 70ms);
    }
    .feature-title {
        font-size: 1.4rem;
        font-weight: var(--heading-weight);
        line-height: 1.25;
    }
    .feature-description {
        margin-top: 0.6rem;
        font-size: 0.98rem;
        line-height: 1.55;
        color: #c9c9d2;
    }

    /* A lone post takes the whole row instead of leaving half of it empty */
    .posts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
        gap: 1rem;
    }

    .links-card {
        display: grid;
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
        gap: 2rem;
        padding: 1.6rem;
        border-radius: var(--radius-3xl);
        background: radial-gradient(
            circle at 100% 100%,
            color-mix(in srgb, var(--app-color) 30%, transparent),
            transparent 55%
        );
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        border: solid 1px var(--card-border);
    }
    .links-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        a {
            display: flex;
            align-items: center;
            gap: 0.9rem;
            padding: 0.7rem 0.9rem;
            border-radius: var(--radius-xl);
            background-color: rgb(255 255 255 / 4%);
            transition: all 0.2s;
        }
        a:hover {
            background-color: color-mix(
                in srgb,
                var(--app-color) 14%,
                rgb(255 255 255 / 6%)
            );
        }
        a:hover .link-external {
            color: var(--app-color-text);
        }
    }
    .link-icon {
        display: flex;
        width: 1.4rem;
        flex-shrink: 0;
        color: var(--app-color-text);
    }
    .link-label {
        display: block;
        font-weight: bold;
    }
    .link-detail {
        display: block;
        font-size: 0.85rem;
        color: #9a9aab;
        word-break: break-all;
    }
    .link-external {
        display: flex;
        width: 1rem;
        flex-shrink: 0;
        margin-left: auto;
        color: #9a9aab;
        transition: color 0.2s;
    }
    .links-cta {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        text-align: center;
    }
    .links-cta-icon {
        width: 4rem;
        height: 4rem;
        border-radius: var(--radius-icon);
    }
    .links-cta-host {
        font-family: 'Fira Code', monospace;
        font-size: 0.8rem;
        color: #9a9aab;
    }

    .disclaimer {
        margin-top: -3rem;
        font-size: 0.9rem;
        color: #9a9aab;
        text-align: center;
    }

    .other-apps {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
    }

    @keyframes rise {
        from {
            opacity: 0;
            transform: translateY(0.8rem);
        }
    }
    @keyframes shot-in {
        from {
            opacity: 0;
            transform: translateX(2rem);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .hero-text > *,
        .hero-shot,
        .feature {
            animation: none;
        }
    }

    @media (max-width: 1000px) {
        .features,
        .other-apps {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 900px) {
        .hero {
            grid-template-columns: minmax(0, 1fr);
            gap: 2.5rem;
        }
        .intro,
        .links-card {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    @media (max-width: 650px) {
        .app-page {
            padding: 0 1rem 4rem 1rem;
            gap: 3.5rem;
        }
        .breadcrumb {
            margin-bottom: 1.1rem;
        }
        .hero {
            margin-top: 0.5rem;
        }
        .hero-icon {
            width: 4rem;
            height: 4rem;
        }
        .hero-title {
            font-size: 2.5rem;
        }
        .hero-tagline {
            font-size: 1.15rem;
        }
        .hero-actions {
            width: 100%;
            > a {
                flex: 1 1 auto;
                justify-content: center;
            }
        }
        .features,
        .other-apps {
            grid-template-columns: minmax(0, 1fr);
        }
        .about > p {
            font-size: 1.08rem;
        }
        .links-card {
            padding: 1.1rem;
        }
        .disclaimer {
            margin-top: -2rem;
        }
    }
</style>
