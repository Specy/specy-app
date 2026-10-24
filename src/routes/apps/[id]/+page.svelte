<script lang="ts">
    import Seo from '$cmp/Seo.svelte';
    import PostCard from '$cmp/PostCard.svelte';
    import AppLinkCard from '$cmp/AppLinkCard.svelte';
    import { appPageProjects } from '$lib/Projects';
    import { appPageLd } from '$lib/jsonld';
    import { resolveImagePreviewUrl } from '$lib/imagePreviews.js';
    import MdOpenInNew from '~icons/mdi/open-in-new';
    import MdCheckCircleOutline from '~icons/mdi/check-circle-outline';
    import MdBookOpenVariant from '~icons/mdi/book-open-variant';
    import FaGithub from '~icons/fa-brands/github';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let project = $derived(data.project);
    let details = $derived(project.details);
    let screenshot = $derived(
        resolveImagePreviewUrl(details.screenshot.src) ??
            details.screenshot.src,
    );
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
    image={details.screenshot.src}
    jsonLd={appPageLd(project)}
/>

<div class="app-page" style="--app-color: {project.color}">
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/#web-apps">Apps</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{project.title}</span>
    </nav>

    <header class="hero">
        <div class="hero-text">
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
        <figure class="hero-shot">
            <div class="window">
                <div class="window-bar" aria-hidden="true">
                    <span class="window-dots">
                        <span></span><span></span><span></span>
                    </span>
                    <span class="window-url">{host}</span>
                </div>
                <img
                    src={screenshot}
                    alt={details.screenshot.alt}
                    width={details.screenshot.width}
                    height={details.screenshot.height}
                />
            </div>
        </figure>
    </header>

    <section class="intro">
        <div class="about">
            <h2 class="section-title">What it is</h2>
            {#each details.about as paragraph}
                <p>{paragraph}</p>
            {/each}
        </div>
        <aside class="audience">
            <h2 class="section-title">Who it is for</h2>
            <ul>
                {#each details.audience as item}
                    <li>
                        <span class="audience-icon" aria-hidden="true">
                            <MdCheckCircleOutline />
                        </span>
                        {item}
                    </li>
                {/each}
            </ul>
        </aside>
    </section>

    <section>
        <h2 class="section-title">Features</h2>
        <div class="features">
            {#each details.features as feature, i (feature.title)}
                <div class="feature" style="--index: {i}">
                    <span class="feature-index" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                    </span>
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
    .app-page {
        --glow: color-mix(in srgb, var(--app-color) 55%, transparent);
        width: 100%;
        max-width: 72rem;
        margin: 0 auto;
        padding: 1rem 2rem 6rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 4.5rem;
    }

    .breadcrumb {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.95rem;
        color: #9a9aab;
        margin-bottom: -3rem;
        > a {
            transition: color 0.2s;
        }
        > a:hover,
        > a:focus-visible {
            color: var(--accent);
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
    }

    .hero-icon {
        width: 5rem;
        height: 5rem;
        border-radius: var(--radius-2xl);
        box-shadow:
            0 0.6rem 2rem -0.4rem var(--glow),
            0 0 0 1px rgb(255 255 255 / 8%);
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
        background-color: var(--app-color);
        color: white;
        font-size: 1.1rem;
        font-weight: bold;
        box-shadow: 0 0.8rem 2rem -0.8rem var(--glow);
        transition: all 0.2s;
    }
    .open-btn:hover,
    .open-btn:focus-visible {
        filter: brightness(1.15);
        transform: translateY(-0.1rem);
        box-shadow: 0 1rem 2.4rem -0.6rem var(--glow);
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
        background-color: rgb(255 255 255 / 16%);
        color: white;
    }

    .open-btn:focus-visible,
    .secondary-btn:focus-visible,
    .links-list a:focus-visible,
    .breadcrumb > a:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }

    .hero-shot {
        position: relative;
        perspective: 1600px;
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

    .window {
        border-radius: var(--radius-2xl);
        overflow: hidden;
        background-color: #1c2029;
        border: solid 1px rgb(255 255 255 / 9%);
        box-shadow:
            0 2rem 4rem -1.5rem rgb(0 0 0 / 70%),
            0 0 0 1px rgb(0 0 0 / 30%);
        transform: rotateY(-7deg) rotateX(3deg);
        transform-origin: left center;
        transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.46, 1);
        > img {
            display: block;
            width: 100%;
            height: auto;
        }
    }
    .hero-shot:hover .window {
        transform: none;
    }

    .window-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.55rem 0.8rem;
        background-color: #232833;
        border-bottom: solid 1px rgb(255 255 255 / 6%);
    }
    .window-dots {
        display: flex;
        gap: 0.35rem;
        > span {
            width: 0.6rem;
            height: 0.6rem;
            border-radius: var(--radius-full);
            corner-shape: var(--corner-shape-round, round);
            background-color: rgb(255 255 255 / 18%);
        }
    }
    .window-url {
        flex: 1;
        max-width: 18rem;
        margin: 0 auto;
        padding: 0.2rem 0.8rem;
        border-radius: var(--radius-full);
        corner-shape: var(--corner-shape-round, round);
        background-color: rgb(0 0 0 / 25%);
        color: #9a9aab;
        font-family: 'Fira Code', monospace;
        font-size: 0.75rem;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    /* ------------------------------------------------------------ sections -- */
    .section-title {
        position: relative;
        font-size: 1.7rem;
        font-weight: bold;
        line-height: 1.2;
        margin-bottom: 1.4rem;
        padding-bottom: 0.6rem;
    }
    .section-title::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 2.5rem;
        height: 3px;
        border-radius: var(--radius-full);
        corner-shape: var(--corner-shape-round, round);
        background: linear-gradient(90deg, var(--accent), var(--app-color));
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
        background:
            linear-gradient(
                160deg,
                color-mix(in srgb, var(--app-color) 22%, transparent),
                transparent 60%
            ),
            rgb(31 36 43 / 50%);
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        border: solid 1px rgb(255 255 255 / 6%);
        > ul {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
        }
        li {
            display: flex;
            gap: 0.7rem;
            font-size: 1.05rem;
            line-height: 1.45;
            color: #dbdbdb;
        }
    }
    .audience-icon {
        display: flex;
        width: 1.25rem;
        flex-shrink: 0;
        margin-top: 0.1rem;
        color: var(--accent);
    }

    .features {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1rem;
    }
    .feature {
        position: relative;
        overflow: hidden;
        padding: 1.2rem 1.3rem 1.3rem 1.3rem;
        border-radius: var(--radius-2xl);
        background-color: rgb(31 36 43 / 50%);
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        transition: all 0.2s;
        animation: rise 0.5s backwards cubic-bezier(0.2, 0.7, 0.46, 1);
        animation-delay: calc(var(--index) * 70ms);
    }
    .feature::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--app-color), transparent 80%);
        opacity: 0.8;
    }
    .feature:hover {
        background-color: rgb(31 36 43 / 75%);
        transform: translateY(-0.15rem);
    }
    .feature-index {
        font-family: 'Fira Code', monospace;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--accent);
        opacity: 0.9;
    }
    .feature-title {
        margin-top: 0.5rem;
        font-size: 1.15rem;
        font-weight: bold;
        line-height: 1.3;
    }
    .feature-description {
        margin-top: 0.5rem;
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
        background:
            radial-gradient(
                circle at 100% 100%,
                color-mix(in srgb, var(--app-color) 30%, transparent),
                transparent 55%
            ),
            rgb(31 36 43 / 50%);
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        border: solid 1px rgb(255 255 255 / 6%);
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
            background-color: rgb(255 255 255 / 10%);
        }
        a:hover .link-external {
            color: var(--accent);
        }
    }
    .link-icon {
        display: flex;
        width: 1.4rem;
        flex-shrink: 0;
        color: #dbdbdb;
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
        border-radius: var(--radius-xl);
        box-shadow: 0 0.6rem 2rem -0.4rem var(--glow);
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
        .window {
            transition: none;
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
        .window {
            transform: none;
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
            margin-bottom: -2.5rem;
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
