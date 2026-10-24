<script lang="ts">
    import Seo from '$cmp/Seo.svelte';
    import Contact from '$cmp/Contact.svelte';
    import AppLinkCard from '$cmp/AppLinkCard.svelte';
    import { appPageProjects, libraries } from '$lib/Projects';
    import { aboutPageLd } from '$lib/jsonld';
    import FaGithub from '~icons/fa-brands/github';
    import FaNpm from '~icons/fa-brands/npm';
    import FaCube from '~icons/fa-solid/cube';
    import MdWeb from '~icons/mdi/web';
    import MdFileDocumentOutline from '~icons/mdi/file-document-outline';
    import MdOpenInNew from '~icons/mdi/open-in-new';

    const PAPER_URL = 'https://doi.org/10.1109/EDUCON67543.2026.11574463';

    // The same profiles the Person's sameAs lists, each one checked to be Specy's
    const profiles = [
        { label: 'GitHub', url: 'https://github.com/Specy', icon: FaGithub },
        { label: 'npm', url: 'https://www.npmjs.com/~specy.dev', icon: FaNpm },
        {
            label: 'crates.io',
            url: 'https://crates.io/users/Specy',
            icon: FaCube,
        },
        { label: 'Portfolio', url: 'https://portfolio.specy.app', icon: MdWeb },
    ];
</script>

<Seo
    title="About Specy - Enrico Menichelli"
    description="Specy is the online name of Enrico Menichelli, an Italian developer who builds free web apps for learning and music, like ASM Editor, ROOC, Tokeko and the Sky and Genshin music apps."
    jsonLd={aboutPageLd()}
/>

<div class="about-page">
    <header class="hero">
        <div class="hero-logo">
            <img src="/images/logo.png" alt="" width="160" height="160" />
        </div>
        <div class="hero-text">
            <p class="eyebrow">Enrico Menichelli</p>
            <h1 class="hero-title">About Specy</h1>
            <p class="lead">
                Specy is the online name of Enrico Menichelli, an Italian
                developer who loves creating apps that help people learn and
                improve themselves.
            </p>
            <ul class="profiles">
                {#each profiles as profile (profile.url)}
                    {@const ProfileIcon = profile.icon}
                    <li>
                        <a
                            href={profile.url}
                            target="_blank"
                            rel="me noreferrer"
                        >
                            <span class="profile-icon"><ProfileIcon /></span>
                            {profile.label}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
    </header>

    <section>
        <h2 class="section-title">Apps</h2>
        <p class="text">
            The apps on specy.app are free to use and run in the browser. Each
            one has a page with what it does and who it is for.
        </p>
        <div class="apps">
            {#each appPageProjects as project, i (project.id)}
                <AppLinkCard {project} index={i} />
            {/each}
        </div>
    </section>

    <section class="university">
        <div>
            <h2 class="section-title">From university courses to apps</h2>
            <p class="text">
                While studying computer science at the University of L'Aquila,
                Specy worked with professors on tools that make it easier for
                students to learn. <a href="/apps/asm-editor">ASM Editor</a>
                was used to teach the computer architecture course,
                <a href="/apps/rooc">ROOC</a> was made to help students of the
                operations research and combinatorial optimization course, and
                <a href="/apps/tokeko">Tokeko</a> teaches compilers and language theory
                by letting you write a grammar and watch a parser read it.
            </p>
            <p class="text">
                Specy's own university notes are published on
                <a href="/apps/learn">Learn</a>.
            </p>
        </div>
        <aside class="paper">
            <div class="paper-kind">
                <span class="paper-icon"><MdFileDocumentOutline /></span>
                Paper, EDUCON 2026
            </div>
            <h3 class="paper-title">
                ASM Editor: Understanding Language Abstractions Through Assembly
                Programming
            </h3>
            <p class="paper-authors">Enrico Menichelli and Luca Forlizzi</p>
            <p class="paper-venue">
                2026 IEEE Global Engineering Education Conference (EDUCON),
                Cairo, Egypt
            </p>
            <a
                class="paper-link"
                href={PAPER_URL}
                target="_blank"
                rel="noreferrer"
            >
                Read the paper
                <span class="paper-link-icon"><MdOpenInNew /></span>
            </a>
        </aside>
    </section>

    <section>
        <h2 class="section-title">Work</h2>
        <p class="text">
            Specy is co-founder and CPTO at
            <a href="https://discerns.ai" target="_blank" rel="noreferrer"
                >Discerns</a
            >. The blog posts about LLMs and RAG are related to that work.
        </p>
    </section>

    <section>
        <h2 class="section-title">How the apps are built</h2>
        <p class="text">
            Most of the apps are built with SvelteKit and TypeScript, and ASM
            Editor and ROOC also run Rust compiled to WebAssembly in the
            browser. Specy enjoys experimenting with the less common features of
            the web, like WebAssembly, the Web Audio and Web MIDI APIs, workers
            and installable web apps.
        </p>
        <p class="text">
            The engines behind the apps are published as libraries: the M68K,
            MIPS, RISC-V, x86-64 and Z80 emulators that run in ASM Editor, the
            dotlr parser generator behind Tokeko, and the rooc modeling language
            and the microlp solver behind ROOC.
        </p>
        <ul class="libraries">
            {#each libraries as library (library.id)}
                <li>
                    <a href={library.url} target="_blank" rel="noreferrer">
                        <span class="library-icon">
                            {#if library.registry === 'npm'}
                                <FaNpm />
                            {:else}
                                <FaCube />
                            {/if}
                        </span>
                        {library.title}
                    </a>
                </li>
            {/each}
        </ul>
        <p class="text">
            While adding a solver to ROOC, Specy found a soundness bug in the
            Rust compiler and reported it as
            <a
                href="https://github.com/rust-lang/rust/issues/132353"
                target="_blank"
                rel="noreferrer">rust-lang/rust#132353</a
            >. The post
            <a href="/blog/posts/a-rustc-soundness-bug-in-the-wild"
                >A rustc soundness bug in the wild</a
            > tells the story.
        </p>
    </section>

    <section>
        <h2 class="section-title">Writing</h2>
        <p class="text">
            On the <a href="/blog">blog</a>, Specy writes about web development,
            TypeScript, Rust, CSS, assembly, optimization, AI, analog
            photography and 3D printing.
        </p>
    </section>
    <div class="contact-slot">
        <Contact />
    </div>
</div>

<style lang="scss">
    .about-page {
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        padding: 2rem 2rem 2rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    /* ---------------------------------------------------------------- hero -- */
    .hero {
        display: flex;
        align-items: center;
        gap: 3rem;
        margin-top: 2rem;
    }

    .hero-logo {
        position: relative;
        flex-shrink: 0;
        width: 10rem;
        height: 10rem;
        animation: rise 0.7s backwards cubic-bezier(0.2, 0.7, 0.46, 1);
        > img {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: var(--radius-3xl);
            box-shadow:
                0 1.5rem 3rem -1rem rgb(0 0 0 / 70%),
                0 0 0 1px rgb(255 255 255 / 8%);
        }
    }

    /* A slow turning halo in the site's accent behind the logo */
    .hero-logo::before {
        content: '';
        position: absolute;
        inset: -1.5rem;
        border-radius: var(--radius-full);
        corner-shape: var(--corner-shape-round, round);
        background: conic-gradient(
            from 0deg,
            rgba(var(--RGB-accent), 0.65),
            transparent 30%,
            rgba(219, 0, 97, 0.45) 55%,
            transparent 80%,
            rgba(var(--RGB-accent), 0.65)
        );
        filter: blur(2rem);
        animation: spin 14s linear infinite;
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

    .eyebrow {
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        letter-spacing: 0.04em;
        color: var(--accent);
    }

    .hero-title {
        margin-top: 0.4rem;
        font-size: 3.6rem;
        font-weight: bold;
        line-height: 1.05;
        text-shadow: 1px 1px 4px rgba(var(--RGB-shadow-color), 0.25);
    }

    .lead {
        margin-top: 1rem;
        font-size: 1.3rem;
        line-height: 1.5;
        color: #dbdbdb;
        max-width: 38rem;
    }

    .profiles {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        margin-top: 1.6rem;
        a {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0.9rem;
            border-radius: var(--radius-full);
            corner-shape: var(--corner-shape-round, round);
            background-color: rgb(255 255 255 / 8%);
            color: #dbdbdb;
            transition: all 0.2s;
        }
        a:hover,
        a:focus-visible {
            background-color: rgb(255 255 255 / 16%);
            color: white;
            transform: translateY(-0.1rem);
        }
    }
    .profile-icon {
        display: flex;
        width: 1.1rem;
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
        background: linear-gradient(90deg, var(--accent), rgb(219, 0, 97));
    }

    .text {
        font-size: 1.15rem;
        line-height: 1.65;
        color: #dbdbdb;
        max-width: 48rem;
        & + .text,
        & + ul + .text {
            margin-top: 1rem;
        }
        a {
            color: var(--accent);
            text-decoration: underline;
            text-underline-offset: 0.15em;
        }
    }

    .apps {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .university {
        display: grid;
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
        gap: 2.5rem;
        align-items: start;
    }

    .paper {
        position: relative;
        overflow: hidden;
        padding: 1.4rem 1.5rem;
        border-radius: var(--radius-2xl);
        background:
            linear-gradient(
                160deg,
                rgba(var(--RGB-accent), 0.18),
                transparent 60%
            ),
            rgb(31 36 43 / 50%);
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        border: solid 1px rgb(255 255 255 / 6%);
    }
    .paper-kind {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-family: 'Fira Code', monospace;
        font-size: 0.8rem;
        color: var(--accent);
    }
    .paper-icon {
        display: flex;
        width: 1rem;
    }
    .paper-title {
        margin-top: 0.8rem;
        font-family: 'Libre Baskerville', serif;
        font-size: 1.15rem;
        line-height: 1.4;
    }
    .paper-authors {
        margin-top: 0.8rem;
        color: #dbdbdb;
    }
    .paper-venue {
        margin-top: 0.3rem;
        font-size: 0.9rem;
        line-height: 1.4;
        color: #9a9aab;
    }
    .paper-link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        margin-top: 1.2rem;
        padding: 0.55rem 0.9rem;
        border-radius: var(--radius-lg);
        background-color: rgb(255 255 255 / 8%);
        font-weight: bold;
        transition: all 0.2s;
    }
    .paper-link:hover,
    .paper-link:focus-visible {
        background-color: rgb(255 255 255 / 16%);
    }
    .paper-link-icon {
        display: flex;
        width: 1rem;
    }

    .libraries {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 1.2rem 0 1.4rem 0;
        a {
            display: flex;
            align-items: center;
            gap: 0.45rem;
            padding: 0.4rem 0.75rem;
            border-radius: var(--radius-lg);
            background-color: rgb(31 36 43 / 70%);
            border: solid 1px rgb(255 255 255 / 7%);
            font-family: 'Fira Code', monospace;
            font-size: 0.85rem;
            color: #dbdbdb;
            transition: all 0.2s;
        }
        a:hover,
        a:focus-visible {
            border-color: var(--accent);
            color: white;
        }
    }
    .library-icon {
        display: flex;
        width: 1rem;
        color: #9a9aab;
    }

    /* Contact centers itself in a narrower column, here it lines up with the
       sections above it instead */
    .contact-slot :global(.wrapper) {
        justify-content: flex-start;
        padding: 0;
        margin-top: 0;
    }

    .profiles a:focus-visible,
    .paper-link:focus-visible,
    .libraries a:focus-visible,
    .text a:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }

    @keyframes rise {
        from {
            opacity: 0;
            transform: translateY(0.8rem);
        }
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .hero-logo,
        .hero-logo::before,
        .hero-text > * {
            animation: none;
        }
    }

    @media (max-width: 900px) {
        .university {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    @media (max-width: 650px) {
        .about-page {
            padding: 0 1rem;
            gap: 3rem;
        }
        .hero {
            flex-direction: column;
            align-items: flex-start;
            gap: 2rem;
            margin-top: 0.5rem;
        }
        .hero-logo {
            width: 6.5rem;
            height: 6.5rem;
            margin-left: 1rem;
        }
        .hero-title {
            font-size: 2.6rem;
        }
        .lead {
            font-size: 1.15rem;
        }
        .apps {
            grid-template-columns: minmax(0, 1fr);
        }
        .text {
            font-size: 1.08rem;
        }
    }
</style>
