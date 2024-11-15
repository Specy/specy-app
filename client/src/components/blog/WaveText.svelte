<script>
    // Props with default values
    export let text;
    export let style = "";
    export let animationDuration = 1.2;
    export let letterDelay = 0.1;
    export let verticalDistance = 5;
    export let skewAngle = 5;
</script>

<div
        class="container"
        style={style}
>
    <div
            class="wavy-text"
    >
        {#each text.split('') as letter, i}
      <span
              style="
          animation-duration: {animationDuration}s;
          animation-delay: {i * letterDelay}s;
          --wave-vertical: {verticalDistance}px;
          --wave-skew: {skewAngle}deg;
        "
      >
        {letter}
      </span>
        {/each}
    </div>
</div>

<style>
    .container {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-family: 'Noto serif';
        font-weight: 600;
        font-size: 1.1rem;
    }

    .wavy-text {
        display: inline-block;
        font-family: inherit;
    }

    span {
        display: inline-block;
        font-family: inherit;
        animation: wave ease-in-out infinite alternate;
    }

    @keyframes wave {
        from {
            transform: translateY(calc(-1 * var(--wave-vertical))) skew(var(--wave-skew));
        }
        to {
            transform: translateY(var(--wave-vertical)) skew(calc(-1 * var(--wave-skew)));
        }
    }

    @media (prefers-reduced-motion) {
        span {
            animation: none;
        }
    }
</style>