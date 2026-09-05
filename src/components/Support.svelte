<script lang="ts">
    interface Props {
        style?: string;
        /** `h1` on /donate, where this block is the page's subject; `h2` elsewhere,
         *  where it is one section under the page's own heading. */
        titleLevel?: 'h1' | 'h2';
    }

    let { style = '', titleLevel = 'h2' }: Props = $props();
</script>

<div class="wrapper" {style}>
    <div class="support" id="donate">
        <svelte:element this={titleLevel} class="title">
            {#if titleLevel === 'h1'}
                Support Me
            {:else}
                <a href="/donate">Support Me</a>
            {/if}
        </svelte:element>
        <div class="text">
            Each App I develop takes months of learning and development. Added
            to that are also the costs of hosting. With a higher budget I can
            afford to not worry so much about how much I spend on the server,
            giving you the best possible experience.<br />I care about giving
            users all features without having to pay for it, neither having
            intrusive ads which can be annoying.
            <br /><br />
            I would be really thankful if you could consider donating in order to
            fund development and costs.
        </div>
        <div class="donation-wrapper">
            <a
                href="https://ko-fi.com/specy"
                target="_blank"
                class="donation-img"
            >
                <img src="/images/kofi.png" alt="kofi" />
            </a>
            <a
                href="https://paypal.me/specyDev"
                target="_blank"
                class="donation-img"
            >
                <img src="/images/paypalme.png" alt="paypal" />
            </a>
        </div>
    </div>
</div>

<style lang="scss">
    .wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 1rem;
    }

    .support {
        max-width: 50rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        > .text {
            color: #dbdbdb;
            margin: 1rem;
            line-height: 1.4;
            font-size: 1.1rem;
        }
    }
    .title {
        font-size: 1.6rem;
        font-weight: bold;
        margin: 0;
        line-height: inherit;
    }
    .donation-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
        justify-content: space-around;
        margin-top: 2rem;
    }
    .donation-wrapper a {
        margin-top: 0.5rem;
    }
    .donation-img {
        height: 4rem;
        display: flex;
        justify-content: center;
        background-color: #efefef;
        border-radius: var(--radius-2xl);
        padding: 0 1rem;
        align-items: center;
    }
    .donation-img img {
        height: 3rem;
    }
</style>
