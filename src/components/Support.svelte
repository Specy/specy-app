<script lang="ts">
    import BeatingHeart from './BeatingHeart.svelte';
    import DonateButtons from './DonateButtons.svelte';

    interface Props {
        style?: string;
    }

    let { style = '' }: Props = $props();
    // The heart beats while a donate button is hovered or focused, as on /donate
    let heartBeating = $state(false);
</script>

<div class="wrapper" {style}>
    <div class="support" id="donate">
        <h2 class="title">
            <a href="/donate">Support my apps</a>
            <span class="title-heart"
                ><BeatingHeart beating={heartBeating} /></span
            >
        </h2>
        <div class="text">
            <p>
                My apps are free to use, with every feature included and no
                intrusive ads. Each app takes months of learning and development,
                and donations go toward the time I spend building them.
            </p>
            <p>
                I'm really thankful for any help in funding the development of
                the apps.
            </p>
        </div>
        <div class="buttons">
            <DonateButtons bind:active={heartBeating} />
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
        width: min(100%, 50rem);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
    .title {
        display: flex;
        align-items: center;
        gap: 0.4em;
        font-size: 1.6rem;
        font-weight: bold;
        margin: 0;
        line-height: inherit;
    }
    .title-heart {
        display: flex;
        width: 1em;
        height: 1em;
    }
    .text {
        color: #dbdbdb;
        line-height: 1.4;
        font-size: 1.1rem;
        > p + p {
            margin-top: 0.8rem;
        }
    }
    .buttons {
        width: 100%;
        margin-top: 0.5rem;
    }
</style>
