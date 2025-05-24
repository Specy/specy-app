<script>
    import {fly} from 'svelte/transition'
    import { sineOut} from 'svelte/easing'

    /** @type {{refresh?: string, children?: import('svelte').Snippet}} */
    let {refresh = '', children} = $props();

    let status = $state('')
    let timeout = setTimeout(() => {
    }, 0)

    function handleProgress(s) {
        if (s === 'started') status = 'progress-70'
        if (s === 'ended') {
            status = 'progress-finish'
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                status = ''
            }, 200)
        }
    }
</script>

<svelte:window
        onsveltekit:navigation-start={() => handleProgress('started')}
        onsveltekit:navigation-end={() => handleProgress('ended')}
/>
{#key refresh}
    <div class={`progress ${status}`}>

    </div>
    <div in:fly={{duration: 1000, opacity: 0, y: -10 }} class="page column">
        {@render children?.()}
    </div>
{/key}
<div class="content-under"></div>

<style lang="scss">
  .content-under {
    height: min(120vh, 100%);
    width: 100%;
    position: absolute;
    //background: linear-gradient(155deg, rgb(22 25 32) 0%, rgb(33 38 48 / 0%) 100%);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
  }

  .progress {
    height: 4px;
    width: 0%;
    background-color: var(--accent);
    position: absolute;
    z-index: 1000;
  }

  .page {
    flex: 1;
  }

  .progress-70 {
    width: 70%;
    transition: all 1s;
  }

  .progress-finish {
    transition: all 0.2s;
    width: 100%;
    background-color: transparent;
  }
</style>