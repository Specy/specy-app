<script lang="ts">
    import Seo from '$cmp/Seo.svelte';
    import AppLinkCard from '$cmp/AppLinkCard.svelte';
    import BeatingHeart from '$cmp/BeatingHeart.svelte';
    import DonateButtons from '$cmp/DonateButtons.svelte';
    import { appPageProjects } from '$lib/Projects';
    import { donations } from '$lib/donations';
    import MdOpenInNew from '~icons/mdi/open-in-new';

    // The hearts beat while a donation option is hovered or focused
    let heartBeating = $state(false);
</script>

<Seo
    title="Donate - Support Specy's apps"
    description="Support Specy's free web apps with a donation on Ko-fi, PayPal or GitHub Sponsors. Donations fund the development of the apps."
/>

<div class="donate-page">
    <header class="hero">
        <h1 class="hero-title">
            Support my <span class="last-word"
                >apps<span class="title-heart"
                    ><BeatingHeart beating={heartBeating} /></span
                ></span
            >
        </h1>
        <p class="lead">
            My apps are free to use, with every feature included and no
            intrusive ads. With your support i can continue developing
            new things.
        </p>
        <div class="hero-actions">
            <DonateButtons bind:active={heartBeating} />
        </div>
    </header>

    <hr class="separator" />

    <section>
        <h2 class="section-title">Where donations go</h2>
        <p class="text">
            Each app I develop takes months of learning and development. I want
            everyone to get every feature without paying for it, and without
            intrusive ads, so donations go toward the time I spend building
            them.
        </p>
    </section>

    <section>
        <h2 class="section-title">The apps you support</h2>
        <p class="text">
            These are the apps I build. They're free to use and run in the
            browser.
        </p>
        <div class="apps">
            {#each appPageProjects as project, i (project.id)}
                <AppLinkCard {project} index={i} />
            {/each}
        </div>
    </section>

    <section class="donate-card">
        <div>
            <h2 class="section-title">Ways to donate</h2>
            <ul class="donate-links">
                {#each donations as donation (donation.url)}
                    {@const DonationIcon = donation.icon}
                    <li>
                        <a
                            href={donation.url}
                            target="_blank"
                            rel="noreferrer"
                            onmouseenter={() => (heartBeating = true)}
                            onmouseleave={() => (heartBeating = false)}
                            onfocus={() => (heartBeating = true)}
                            onblur={() => (heartBeating = false)}
                        >
                            <span class="link-icon"><DonationIcon /></span>
                            <span>
                                <span class="link-label">{donation.label}</span>
                                <span class="link-detail"
                                    >{donation.url.replace('https://', '')}</span
                                >
                            </span>
                            <span class="link-external"><MdOpenInNew /></span>
                        </a>
                    </li>
                {/each}
            </ul>
        </div>
        <div class="thanks">
            <span class="thanks-heart"
                ><BeatingHeart beating={heartBeating} /></span
            >
            <p class="thanks-title">Thank you</p>
            <p class="thanks-text">
                I'm really thankful for any help in funding the development of
                the apps.
            </p>
        </div>
    </section>
</div>

<style lang="scss">
    .donate-page {
        /* The tea cup's heart, the one color on this page that isn't the accent */
        --heart: rgb(214 48 79);
        /* Translucent cards, read by this page's cards and by the app cards */
        --card-background: rgb(255 255 255 / 4%);
        --card-background-hover: rgb(255 255 255 / 7%);
        --card-border: color-mix(in srgb, var(--accent) 22%, transparent);
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        padding: 2rem 2rem 6rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    /* ---------------------------------------------------------------- hero -- */
    .hero {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-top: 2rem;
        > * {
            animation: rise 0.6s backwards cubic-bezier(0.2, 0.7, 0.46, 1);
        }
        > :nth-child(2) {
            animation-delay: 80ms;
        }
        > :nth-child(3) {
            animation-delay: 160ms;
        }
    }

    .hero-title,
    .section-title {
        font-family: var(--heading-font), Rubik, sans-serif;
    }

    .hero-title {
        font-size: 3.6rem;
        font-weight: bold;
        line-height: 1.05;
        text-shadow: 1px 1px 4px rgba(var(--RGB-shadow-color), 0.25);
    }
    /* The heart follows the last word and never wraps onto a line of its own */
    .last-word {
        white-space: nowrap;
    }
    .title-heart {
        display: inline-block;
        width: 1em;
        height: 1em;
        margin-left: 0.25em;
        /* centered on the lowercase letters beside it, not on the capitals */
        vertical-align: -0.25em;
        filter: drop-shadow(
            0 0.15em 0.35em color-mix(in srgb, var(--heart) 50%, transparent)
        );
    }

    .lead {
        margin-top: 1rem;
        font-size: 1.3rem;
        line-height: 1.5;
        color: #dbdbdb;
        max-width: 38rem;
    }

    .hero-actions {
        width: 100%;
        margin-top: 2rem;
    }

    .separator {
        height: 1px;
        border: none;
        background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--accent) 45%, transparent),
            transparent
        );
    }

    /* ------------------------------------------------------------ sections -- */
    .section-title {
        font-size: 2rem;
        font-weight: var(--heading-weight);
        line-height: 1.2;
        margin-bottom: 1.4rem;
    }

    .text {
        font-size: 1.15rem;
        line-height: 1.65;
        color: #dbdbdb;
        max-width: 48rem;
    }

    .apps {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .donate-card {
        display: grid;
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
        gap: 2rem;
        padding: 1.6rem;
        border-radius: var(--radius-3xl);
        background: radial-gradient(
            circle at 100% 100%,
            color-mix(in srgb, var(--heart) 22%, transparent),
            transparent 55%
        );
        box-shadow: 3px 3px 12px rgb(0 0 0 / 20%);
        border: solid 1px var(--card-border);
    }
    .donate-links {
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
        a:hover,
        a:focus-visible {
            background-color: color-mix(
                in srgb,
                var(--accent) 14%,
                rgb(255 255 255 / 6%)
            );
        }
        a:hover .link-external,
        a:focus-visible .link-external {
            color: var(--accent);
        }
    }
    .link-icon {
        display: flex;
        width: 1.4rem;
        flex-shrink: 0;
        color: var(--accent);
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
    .thanks {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.6rem;
        text-align: center;
    }
    .thanks-heart {
        display: flex;
        width: 3.5rem;
        height: 3.5rem;
        margin-bottom: 0.4rem;
        filter: drop-shadow(
            0 0.5rem 1.2rem color-mix(in srgb, var(--heart) 50%, transparent)
        );
    }
    .thanks-title {
        font-family: var(--heading-font), Rubik, sans-serif;
        font-size: 1.6rem;
        font-weight: var(--heading-weight);
    }
    /* Balanced, so it breaks after "help in" whenever it takes two lines */
    .thanks-text {
        font-size: 0.95rem;
        line-height: 1.55;
        color: #c9c9d2;
        text-wrap: balance;
    }

    .donate-links a:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }

    @keyframes rise {
        from {
            opacity: 0;
            transform: translateY(0.8rem);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .hero > * {
            animation: none;
        }
    }

    /* Narrower than this, the thank you column would squeeze its text */
    @media (max-width: 900px) {
        .donate-card {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    @media (max-width: 650px) {
        .donate-page {
            padding: 0 1rem 4rem 1rem;
            gap: 3rem;
        }
        .hero {
            margin-top: 0.5rem;
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
