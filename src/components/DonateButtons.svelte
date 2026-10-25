<script lang="ts">
    import { donations } from '$lib/donations';

    interface Props {
        /** On while a button is hovered or focused, for a heart to beat along */
        active?: boolean;
    }

    let { active = $bindable(false) }: Props = $props();
</script>

<div class="donate-buttons">
    {#each donations as donation, i (donation.url)}
        {@const DonationIcon = donation.icon}
        <a
            class={i === 0 ? 'primary-btn' : 'secondary-btn'}
            href={donation.url}
            target="_blank"
            rel="noreferrer"
            onmouseenter={() => (active = true)}
            onmouseleave={() => (active = false)}
            onfocus={() => (active = true)}
            onblur={() => (active = false)}
        >
            <span class="btn-icon"><DonationIcon /></span>
            {donation.action}
        </a>
    {/each}
</div>

<style lang="scss">
    .donate-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
    }

    .btn-icon {
        display: flex;
        width: 1.1rem;
        flex-shrink: 0;
    }

    /* Darkened from the accent until white text on it passes AA */
    .primary-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        padding: 0.85rem 1.4rem;
        border-radius: var(--radius-xl);
        background-color: color-mix(in srgb, var(--accent) 80%, black);
        color: white;
        font-size: 1.1rem;
        box-shadow:
            0 0.8rem 2rem -0.8rem
                color-mix(in srgb, var(--accent) 55%, transparent),
            inset 0 1px 0 rgb(255 255 255 / 18%);
        transition: all 0.2s;
    }
    .primary-btn:hover,
    .primary-btn:focus-visible {
        transform: translateY(-0.1rem);
        box-shadow:
            0 1rem 2.6rem -0.5rem
                color-mix(in srgb, var(--accent) 55%, transparent),
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
            var(--accent) 22%,
            rgb(255 255 255 / 10%)
        );
        color: white;
    }

    .primary-btn:focus-visible,
    .secondary-btn:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
    }

    @media (max-width: 650px) {
        .donate-buttons {
            width: 100%;
            > a {
                flex: 1 1 auto;
                justify-content: center;
            }
        }
    }
</style>
